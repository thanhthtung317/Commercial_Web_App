import React from 'react'
import CustomSelect from './CustomSelect'

const ProductDetailComponent = ({image, title, price, category, id, description}) => {
  return (
    <article className='article-product-detail'>
        <div className='container-detail-product'>
            <div className="container-img">
                <img src={image} alt={title} />
            </div>
            <div className="container-center-product">
                <div className="info-product">
                    <h1 className='name-product'>{title}</h1>
                    <h2 className='price-product'>${price}</h2>
                    <div className="container-minor-info">
                        <h3 className="availability">availability: <span className="info">in stock</span></h3>
                        <h3 className="id-product">product id: <span className="info">{id}</span></h3>
                        <h3 className="categories">categories: <span className="info">{category}</span></h3>
                    </div>
                </div>
                <div className="container-size-color-quantity">
                    <CustomSelect className='select-color' label='color'/>
                    <CustomSelect className='select-size' label={'size'}/>
                    <div className="field-quantity">
                        <label htmlFor="quantity-id">quantity</label>
                        <input id='quantity-id' type="number" />
                    </div>
                </div>
                <div className="container-button">
                    <button className="btn-add-to-cart">
                        add to cart
                    </button>
                </div>
            </div>
        </div>
        <div className="container-desc">
            <h2>description:</h2>
            <p className="desc">
                {description}
            </p>
        </div>
    </article>
  )
}

export default React.memo(ProductDetailComponent)