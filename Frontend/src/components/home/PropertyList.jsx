import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import "../../css/Home.css";
import { useDispatch, useSelector } from "react-redux";
import { propertyAction } from "../../store/Property/Property-slice";
import { getAllProperties } from "../../store/Property/Property-action";

const Card = ({ id, image, name, address, price }) => {
    return (
        <figure className="property">

            <Link to={`/propertylist/${id}`}>
                <img
                    src={image || "/assets/image1.jpeg"}
                    alt="Propertyimg"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/assets/image1.jpeg";
                    }}
                />
            </Link>

            <h4>{name}</h4>

            <figcaption>
                <main className="propertydetails">

                    <h5>{name}</h5>

                    <h6>
                        <span className="material-symbols-outlined houseicon">
                            home_pin
                        </span>
                        {address}
                    </h6>

                    <p>
                        <span className="price">₹{price}</span> per night
                    </p>

                </main>
            </figcaption>

        </figure>
    );
};

const PropertyList = () => {

    const [currentPage, setCurrentPage] = useState({
        page: 1
    });

    const dispatch = useDispatch();

    // ✅ Correct Redux state
    const {
        properties = [],
        totalProperties = 0,
        loading = false,
        error = null
    } = useSelector((state) => state.property || {});

    const lastPage = Math.ceil((totalProperties || 0) / 12);

    const propertyListRef = useRef(null);

    useEffect(() => {

        const fetchProperties = async (page) => {

            dispatch(
                propertyAction.updateSearchParams({
                    page
                })
            );

            dispatch(getAllProperties());
        };

        fetchProperties(currentPage.page);

    }, [currentPage, dispatch]);

    useEffect(() => {

        if (propertyListRef.current) {

            gsap.fromTo(
                propertyListRef.current.children,

                {
                    y: 50,
                    opacity: 0
                },

                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power2.out"
                }
            );

        }

    }, [properties]);

    // Loading
    if (loading) {
        return <p>Loading properties...</p>;
    }

    // Error
    if (error) {
        return <p>{error}</p>;
    }

    return (
        <>
            {properties.length === 0 ? (

                <p className="not_found">
                    Property not found
                </p>

            ) : (

                <div
                    className="propertylist"
                    ref={propertyListRef}
                >

                    {properties.map((property) => (

                        <Card
                            key={property._id}
                            id={property._id}
                            image={property.image?.[0]?.url || property.images?.[0]?.url || ""}
                            name={property.propertyName}
                            address={property.address ? `${property.address.city || ''}, ${property.address.state || ''} ${property.address.pincode || ''}` : ''}
                            price={property.price}
                            slug={property.slug}
                        />

                    ))}

                </div>
            )}

            <div className="pagination">

                <button
                    className="previous_btn"

                    onClick={() =>
                        setCurrentPage((prev) => ({
                            page: prev.page - 1
                        }))
                    }

                    disabled={currentPage.page === 1}
                >
                    <span className="material-symbols-outlined">
                        arrow_back_ios_new
                    </span>
                </button>

                <button
                    className="next_btn"

                    onClick={() =>
                        setCurrentPage((prev) => ({
                            page: prev.page + 1
                        }))
                    }

                    disabled={
                        properties.length < 12 ||
                        currentPage.page === lastPage
                    }
                >
                    <span className="material-symbols-outlined">
                        arrow_forward_ios
                    </span>
                </button>

            </div>
        </>
    );
};

export default PropertyList;