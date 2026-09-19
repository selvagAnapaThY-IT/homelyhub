// ---- APIFeatures: builds the search query, 
// The listings page has filters, a search box and pages. Doing
// all that inside the controller would make it 100 lines long.
// So we keep it here, and the controller stays clean:
//     new APIFeatures(Property.find(), req.query)
//       .filter().search().paginate()
//
// A class is a blueprint. 'new' makes one copy to work with.
class APIFeatures {
  // constructor runs once, when we say 'new APIFeatures(...)'
  // query       = the unfinished mongoose search
  // queryString = what the user asked for (req.query), the
  //               part of the address after the ? mark
  constructor(query, queryString) {
    (this.query = query), (this.queryString = queryString);
  }

  // FILTER - the tick boxes: price, type, room, amenities
  filter() {
    let filterQuery = {};
    let queryObj = { ...this.queryString };

    // PRICE. $gte = greater than or equal, $lte = less or equal.
    if (queryObj.minPrice || queryObj.maxPrice) {
      filterQuery.price = {};
      if (queryObj.minPrice && !isNaN(Number(queryObj.minPrice))) {
        filterQuery.price.$gte = Number(queryObj.minPrice);
      }
      if (queryObj.maxPrice && !isNaN(Number(queryObj.maxPrice)) && !String(queryObj.maxPrice).includes(">")) {
        filterQuery.price.$lte = Number(queryObj.maxPrice);
      }
      if (Object.keys(filterQuery.price).length === 0) {
        delete filterQuery.price;
      }
    }

    // PROPERTY TYPE
    if (queryObj.propertyType && String(queryObj.propertyType).trim() !== "") {
      const rawTypes = Array.isArray(queryObj.propertyType)
        ? queryObj.propertyType
        : String(queryObj.propertyType).split(",");

      const regexTypes = rawTypes
        .map((t) => String(t).trim())
        .filter(Boolean)
        .map((t) => {
          // Replace hyphens/spaces to match e.g. "guest-house" with "GuestHouse" or "Guest House"
          const cleanPattern = t.replace(/[-_]/g, "\\s*");
          return new RegExp(cleanPattern, "i");
        });

      if (regexTypes.length > 0) {
        filterQuery.propertyType = { $in: regexTypes };
      }
    }

    // ROOM TYPE
    if (queryObj.roomType && String(queryObj.roomType).trim() !== "") {
      const rawRooms = Array.isArray(queryObj.roomType)
        ? queryObj.roomType
        : String(queryObj.roomType).split(",");

      const regexRooms = rawRooms
        .map((r) => String(r).trim())
        .filter(Boolean)
        .map((r) => new RegExp(`^${r}$`, "i"));

      if (regexRooms.length > 0) {
        filterQuery.roomType = { $in: regexRooms };
      }
    }

    // AMENITIES
    if (queryObj.amenities) {
      const rawAmenities = Array.isArray(queryObj.amenities)
        ? queryObj.amenities
        : String(queryObj.amenities).split(",");

      const regexAmenities = rawAmenities
        .map((a) => String(a).trim())
        .filter(Boolean)
        .map((a) => new RegExp(a, "i"));

      if (regexAmenities.length > 0) {
        filterQuery["amenities.name"] = { $all: regexAmenities };
      }
    }

    this.query = this.query.find(filterQuery);
    return this;
  }


  // SEARCH - the box on top: city, guests, dates
  search() {
    let searchQuery = {};
    let queryObj = { ...this.queryString };

    if (queryObj.city && typeof queryObj.city === "string" && queryObj.city.trim() !== "") {
      const cleanSearch = queryObj.city.trim();
      const words = cleanSearch
        .toLowerCase()
        .split(/[\s,]+/)
        .filter((w) => w.length >= 2);

      const regexPattern = words.length > 0 ? words.join("|") : cleanSearch.toLowerCase().replaceAll(" ", "");

      searchQuery.$or = [
        { "address.city": { $regex: regexPattern, $options: "i" } },
        { "address.state": { $regex: regexPattern, $options: "i" } },
        { "address.area": { $regex: regexPattern, $options: "i" } },
        { propertyName: { $regex: regexPattern, $options: "i" } }
      ];
    }

    // GUESTS. The house must hold at least this many people.
    if (queryObj.guests) {
      const guestNum = Number(queryObj.guests);
      const guestQuery = {
        $or: [
          { maximumGuests: { $gte: guestNum } },
          { maximumGuest: { $gte: guestNum } }
        ]
      };
      if (searchQuery.$and) {
        searchQuery.$and.push(guestQuery);
      } else {
        searchQuery.$and = [guestQuery];
      }
    }

    // DATES - hide houses already booked on those days
    if (queryObj.dateIn && queryObj.dateOut) {
      const parseQueryDate = (dateStr) => {
        if (!dateStr) return null;
        if (dateStr instanceof Date) return dateStr;
        const str = String(dateStr).trim();
        if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(str)) {
          const [d, m, y] = str.split("-").map(Number);
          return new Date(y, m - 1, d);
        }
        const parsed = new Date(str);
        return isNaN(parsed.getTime()) ? null : parsed;
      };

      const dIn = parseQueryDate(queryObj.dateIn);
      const dOut = parseQueryDate(queryObj.dateOut);

      if (dIn && dOut) {
        const dateQuery = {
          $or: [
            {
              currentBookings: {
                $not: {
                  $elemMatch: {
                    $or: [
                      { fromDate: { $lt: dOut }, toDate: { $gt: dIn } },
                      { fromDate: { $lt: dIn }, toDate: { $gt: dIn } }
                    ]
                  }
                }
              }
            },
            {
              currentBooking: {
                $not: {
                  $elemMatch: {
                    $or: [
                      { fromDate: { $lt: dOut }, toDate: { $gt: dIn } },
                      { fromDate: { $lt: dIn }, toDate: { $gt: dIn } }
                    ]
                  }
                }
              }
            }
          ]
        };

        if (searchQuery.$and) {
          searchQuery.$and.push(dateQuery);
        } else {
          searchQuery.$and = [dateQuery];
        }
      }
    }

    // add these rules on top of the filter rules
    this.query = this.query.find(searchQuery);
    return this;
  }


  // PAGINATE - show 12 at a time, not 500 at once
  paginate() {
    // * 1 turns the text '2' into the number 2.
    // || 1 means: nothing sent, so start at page 1.
    let page = this.queryString.page * 1 || 1;
    // how many per page. 12 by default.
    let limit = this.queryString.limit * 1 || 12;
    // page 1 skips 0, page 2 skips 12, page 3 skips 24
    let skip = (page - 1) * limit;

    // skip that many, then take only 'limit' of them
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}


// propertyController imports this to build the listings search
export { APIFeatures };
