import { ReactComponent as ArrowTopIcon } from '../../images/icon/arrow_top_icon.svg'

function GoTopButton({ onGoTop }) {
    return (
        <>
            <button type='button' className='goTop-btn' onClick={onGoTop}>
                <ArrowTopIcon />
                <span>TOP</span>
            </button>
        </>
    )
}

export default GoTopButton
