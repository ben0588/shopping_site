import { useOutletContext } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton' // 引用  react-loading-skeleton 套件
import 'react-loading-skeleton/dist/skeleton.css' // 引用  react-loading-skeleton 套件

const ProductDescribeSection = () => {
    const { descriptionImages } = useOutletContext()
    return (
        <section className='product-describe-container'>
            <h3 className='product-describe-title'>商品描述</h3>
            <div className='product-describe-content'>
                {descriptionImages ? (
                    descriptionImages.map((item, index) => (
                        <img src={item} alt={item} key={index} className='product-describe-img' />
                    ))
                ) : (
                    <Skeleton className='img-container-skeleton' />
                )}
            </div>
        </section>
    )
}
export default ProductDescribeSection
