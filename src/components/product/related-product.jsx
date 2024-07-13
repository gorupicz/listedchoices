import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cart-slice";
import { useState } from "react";
import {
  addToWishlist,
  deleteFromWishlist,
} from "@/store/slices/wishlist-slice";
import QuickViewtModal from "@/components/modals/quickViewModal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import numeral from 'numeral'; 
const RelatedProduct = ({
  productData,
  slug,
  baseUrl,
  discountedPrice,
  productPrice,
  cartItem,
  wishlistItem,
  compareItem,
}) => {

  let badgeCount = 0;

  let statusBadge = "";

  if (productData.status) {
    statusBadge = productData.status;
    badgeCount++;
  }
  let vacationRentalStatusBadge = "";

  if (!productData.fund) {
    vacationRentalStatusBadge = productData.vacationRentalDetails.status;
    badgeCount++;
  }

  let typeBadge = "";

  if (productData.fund) {
    typeBadge = "Fund";
  } else {
    typeBadge = productData.propertyTypes;
  }

  let marketBadge = "";
  if (productData.market) {
    marketBadge = productData.market;
  }

  if (typeBadge) {
    badgeCount++;
  }

  

  const dispatch = useDispatch();
  const [modalShow, setModalShow] = useState(false);

  const wishListTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Wishlist
    </Tooltip>
  );
  const quickViewTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Quick View
    </Tooltip>
  );
  const addToCartTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Add To Cart
    </Tooltip>
  );
  return (
    <>
      <div className="ltn__product-item ltn__product-item-4 ltn__product-item-5">
        <div className="product-img">
          <Link href={`/${baseUrl}/${slug}`}>
            <img
              src={`/img/product-3/${productData.productImg}`}
              alt={`${productData.title}`}
            />
          </Link>
          <div className="real-estate-agent">
            <div className="agent-img">
              <Link href={`/${baseUrl}/${slug}`}>
                <img
                  src={`/img/blog/author.jpg`}
                  alt={`${productData.title}`}
                />
              </Link>
            </div>
          </div>
          <div className="product-hover-action">
            <ul>
              <span className="product-hover-action-quickview">
              <li>
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={quickViewTooltip}
                  >
                    <button onClick={() => setModalShow(true)}>
                      <i className="flaticon-expand"></i>
                    </button>
                  </OverlayTrigger>
              </li>
              </span>
              <li>
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={wishListTooltip}
                >
                  <button
                    onClick={
                      wishlistItem !== undefined
                        ? () => dispatch(deleteFromWishlist(productData.id))
                        : () => dispatch(addToWishlist(productData))
                    }
                  >
                    <i className="flaticon-heart-1"></i>
                  </button>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={addToCartTooltip}
                >
                  <button onClick={() => dispatch(addToCart(productData))}>
                    <i className="flaticon-add"></i>
                  </button>
                </OverlayTrigger>
              </li>
            </ul>
          </div>
        </div>
        <Link href={`/${baseUrl}/${slug}`}>
        <div className="product-info">
          <div className="product-badge">
                <span
                  className={`sale-badge ${productData.status == "new" ? "bg-black" : "display-none"}`}
                >
                {statusBadge}
              </span> <span
                className={`sale-badge ${productData.fund ? "bg-green" : "bg-blue"}`}
              >
                {typeBadge}
              </span> <span
                className={`sale-badge ${productData.fund ? "display-none" : "bg-orange"}`}>
                {vacationRentalStatusBadge}
              </span> {badgeCount < 3 ? (
                <span className={`sale-badge ${marketBadge ? "bg-green" : "display-none"}`}>
                  {marketBadge} market
                </span>
              ) : null}

          </div>
          <h2 className="product-title">
            <Link href={`/${baseUrl}/${slug}`}>{productData.title}</Link>
          </h2>
          <div className="product-img-location">
            <ul>
              <li>
                <Link href={`/${baseUrl}/${slug}`}>
                  <i className="flaticon-pin"></i>
                  {productData.locantion}
                </Link>
              </li>
            </ul>
          </div>
          <ul className="ltn__plot-brief">
            <li>
              <span>{productData.vacationRentalDetails.rentals}</span>
              <span className="ms-1">Rentals</span>
            </li>
            <li>
              <span>{productData.vacationRentalDetails.reviews}</span>
              <span className="ms-1">Reviews</span>
            </li>
            <li>
              ★{" "}<span>{productData.vacationRentalDetails.score}</span>
              <span className="ms-1">
                  {productData.vacationRentalDetails.reviews > 4.8 ? "Excellent" : "Very Good"}
              </span>
            </li>
          </ul>
        </div>
          <div className="product-info-bottom">
            <div className="product-price amount-available">
              <span>
                {Number.isInteger(parseFloat(numeral(productData.amountAvailable).format('(0.0a)').slice(0, -1))) ? numeral(productData.amountAvailable).format('($0a)') : numeral(productData.amountAvailable).format('($0.0a)')}
                <label> Available</label>
              </span>
            </div>
            <div className="product-price">
              <span>
                {Number.isInteger(parseFloat(numeral(productData.price).format('(0.0a)').slice(0, -1))) ? numeral(productData.price).format('($0a)') : numeral(productData.price).format('($0.0a)')}
                <label> Total</label>
              </span>
            </div>
          </div>
        </Link>
      </div>

      <QuickViewtModal
        productData={productData}
        show={modalShow}
        onHide={() => setModalShow(false)}
        slug={slug}
        discountedprice={discountedPrice}
        productprice={productPrice}
        cartitem={cartItem}
        wishlistitem={wishlistItem}
        compareitem={compareItem}
      />
    </>
  );
};

export default RelatedProduct;
