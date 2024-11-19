import { useTranslation } from 'react-i18next';
import {
  getIndividualAminities,
  getIndividualAminitiesList,
  priceRange,
  bedBath,
  getIndividualCategories,
  setActiveSort,
} from "@/lib/product";
import FilterByPrice from "../../FilterByPrice";

const SideBar = ({ products, getSortParams }) => {
  const { t } = useTranslation('properties/sideBar');

  const aminities = getIndividualAminities(products);
  const aminitiesList = getIndividualAminitiesList(products);
  const priceRanges = priceRange(products);
  const bedBaths = bedBath(products);
  const categories = getIndividualCategories(products);

  return (
    <>
      <aside className="sidebar ltn__shop-sidebar ltn__right-sidebar">
        <h3 className="mb-10 mt-20">{t('advanceInformation')}</h3>
        <label className="mb-30">
          <small>{t('aboutResults')}</small>
        </label>
        <div className="widget ltn__menu-widget">
          <h4 className="ltn__widget-title">{t('propertyType')}</h4>
          {aminities.length > 0 ? (
            <>
              <ul>
                {aminities.map((aminitie, key) => (
                  <li key={key}>
                    <div>
                      <label className="checkbox-item">
                        {aminitie.name}
                        <input
                          onClick={(e) => {
                            getSortParams("propertyTypes", aminitie.name);
                            setActiveSort(e);
                          }}
                          type="checkbox"
                        />
                        <span className="checkmark"></span>
                      </label>
                      <span className="categorey-no"></span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            t('noCategoriesFound')
          )}

          <hr />
          <h4 className="ltn__widget-title">{t('amenities')}</h4>
          {aminitiesList.length > 0 ? (
            <>
              <ul>
                {aminitiesList.map((aminitie, key) => (
                  <li key={key}>
                    <div>
                      <label className="checkbox-item">
                        {aminitie.name}
                        <input
                          onClick={(e) => {
                            getSortParams("AmenitiesList", aminitie.name);
                            setActiveSort(e);
                          }}
                          type="checkbox"
                        />
                        <span className="checkmark"></span>
                      </label>
                      <span className="categorey-no"></span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            t('noCategoriesFound')
          )}

          <hr />
          <h4 className="ltn__widget-title">{t('priceRange')}</h4>
          {priceRanges.length > 0 ? (
            <>
              <ul>
                {priceRanges.map((price, key) => (
                  <li key={key}>
                    <div>
                      <label className="checkbox-item">
                        {price.name}
                        <input
                          onClick={(e) => {
                            getSortParams("AmenitiesList", price.name);
                            setActiveSort(e);
                          }}
                          type="checkbox"
                        />
                        <span className="checkmark"></span>
                      </label>
                      <span className="categorey-no"></span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            t('noCategoriesFound')
          )}

          <div className="ltn__price-filter-widget mt-30">
            <h4 className="ltn__widget-title">{t('filterByPrice')}</h4>
            <div className="price_filter">
              <FilterByPrice />
            </div>
          </div>
          <hr />
          <h4 className="ltn__widget-title">{t('bedBath')}</h4>
          {bedBaths.length > 0 ? (
            <>
              <ul>
                {bedBaths.map((bath, key) => (
                  <li key={key}>
                    <div>
                      <label className="checkbox-item">
                        {bath.name}
                        <input
                          onClick={(e) => {
                            getSortParams("AmenitiesList", bath.name);
                            setActiveSort(e);
                          }}
                          type="checkbox"
                        />
                        <span className="checkmark"></span>
                      </label>
                      <span className="categorey-no"></span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            t('noCategoriesFound')
          )}
          <hr />
          <h4 className="ltn__widget-title">{t('category')}</h4>
          {categories.length > 0 ? (
            <>
              <ul>
                {categories.map((categorie, key) => (
                  <li key={key}>
                    <div>
                      <label className="checkbox-item">
                        {categorie.name}
                        <input
                          onClick={(e) => {
                            getSortParams("category", categorie.name);
                            setActiveSort(e);
                          }}
                          type="checkbox"
                        />
                        <span className="checkmark"></span>
                      </label>
                      <span className="categorey-no"></span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            t('noCategoriesFound')
          )}
        </div>
      </aside>
    </>
  );
};

export default SideBar;
