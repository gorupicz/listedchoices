import Link from "next/link";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getDiscountPrice, productSlug } from "@/lib/product";
import { deleteFromCart } from "@/store/slices/cart-slice";
import { useTranslation } from 'react-i18next';

const HeaderCartMenu = function ({ cartMenuOpener, closeSideBar }) {
  const { t } = useTranslation('header/elements/cartMenu');
  let cartTotalPrice = 0;
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  return (
    <div
      id="ltn__utilize-cart-menu"
      className={`ltn__utilize ltn__utilize-cart-menu ${
        cartMenuOpener ? "ltn__utilize-open" : ""
      }`}
    >
      <div className="ltn__utilize-menu-inner ltn__scrollbar">
        <div className="ltn__utilize-menu-head">
          <span className="ltn__utilize-menu-title">{t('cartTitle')}</span>
          <button onClick={closeSideBar} className="ltn__utilize-close">
            {t('closeButton')}
          </button>
        </div>

        {cartItems.length > 0 ? <>
            <div className="mini-cart-product-area ltn__scrollbar">
              {cartItems.map((product, key) => {
                let imagecount = key + 1;
                const slug = productSlug(product.title);
                const discountedPrice = getDiscountPrice(
                  product.price,
                  product.discount
                ).toFixed(2);
                cartTotalPrice += discountedPrice * product.quantity;
                return (
                  <div key={key} className="mini-cart-item clearfix">
                    <div className="mini-cart-img">
                      <Link href={`/properties/${slug}`}>
                        <img
                          src={`/img/product/${imagecount}.png`}
                          alt="Image"
                        />
                      </Link>
                      <span
                        onClick={() =>
                          dispatch(deleteFromCart(product.cartItemId))
                        }
                        className="mini-cart-item-delete"
                      >
                        <FaTimes />
                      </span>
                    </div>
                    <div className="mini-cart-info">
                      <h6>
                        <Link href={`/properties/${slug}`}>{product.title}</Link>
                      </h6>
                      <span className="mini-cart-quantity">
                        {product.quantity} x <span>$</span> {discountedPrice}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mini-cart-footer">
              <div className="mini-cart-sub-total">
                <h5>
                  {t('subtotal')}: <span>${cartTotalPrice.toFixed(2)}</span>
                </h5>
              </div>
              <div className="btn-wrapper">
                <Link href="/cart" className="theme-btn-1 btn btn-effect-1">
                  {t('viewCart')}
                </Link>
                <Link href="/checkout" className="theme-btn-2 btn btn-effect-2">
                  {t('checkout')}
                </Link>
              </div>
              <p>{t('freeShipping')}</p>
            </div>
          </> : <p>{t('noProducts')}</p>}
      </div>
    </div>
  );
};

export default HeaderCartMenu;
