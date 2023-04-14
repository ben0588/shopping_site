import React from 'react'
// ---- 引用 svg 轉換成 icon
import { ReactComponent as TwitterIcon } from '../../images/icon/media/twitter_logo_icon.svg'
import { ReactComponent as FacebookIcon } from '../../images/icon/media/facebook_logo_icon.svg'
import { ReactComponent as YoutubeIcon } from '../../images/icon/media/youtube_logo_icon.svg'
import { ReactComponent as InstagramIcon } from '../../images/icon/media/instagram_logo_icon.svg'
import { ReactComponent as LinkedinIcon } from '../../images/icon/media/linkedin_logo_icon.svg'
import { ReactComponent as LineIcon } from '../../images/icon/media/line_logo_icon.svg'
import { ReactComponent as TwitchIcon } from '../../images/icon/media/twitch_logo_icon.svg'
import payment from '../../images/icon/payment/payment.png'
import { Link } from 'react-router-dom'

const aboutList = [
    { title: '公司簡介', patch: '/' },
    { title: '會員中心', patch: '/user' },
    { title: '最新消息', patch: '/newsLatest' },
]
const serveList = [
    { title: '服務條款', patch: '/' },
    { title: '常見問題 Q & A', patch: '/' },
    { title: '退款政策', patch: '/' },
    { title: '隱私權政策', patch: '/' },
]
const contactList = [
    { title: '客服信箱：energy9527z@gmail.com', href: 'mailto:energy9527z@gmail.com' },
    { title: '客服專線：09-XXX-XXXXX', href: 'tel:09-XXX-XXXXX' },
    { title: '傳真：09-XXX-XXXXX-123', href: 'tel:09-XXX-XXXXX-123' },
    {
        title: '地址：40701台中市西屯區台灣大道三段99號',
        href: 'https://goo.gl/maps/i5iJd259okiTgbNP9',
        target: '_blank',
        rel: 'noopener noreferrer',
    },
    { title: 'LINE@：@xxxxx', href: 'https://line.me/', target: '_blank', rel: 'noopener noreferrer' },
]

function Footer() {
    return (
        <footer className='footer-container'>
            <div className='footer-inner-container'>
                <ul className='footer-about-content'>
                    <h4>關於我們</h4>

                    {aboutList.map((item, index) => {
                        return (
                            <li className='footer-about-items' key={index}>
                                <Link to={item.patch}>{item.title}</Link>
                            </li>
                        )
                    })}
                </ul>
                <ul className='footer-serve-content'>
                    <h4>客戶服務</h4>
                    {serveList.map((item, index) => {
                        return (
                            <li className='footer-serve-items' key={index}>
                                <Link to={item.patch}>{item.title}</Link>
                            </li>
                        )
                    })}
                </ul>
                <ul className='footer-contact-content'>
                    <h4>聯絡我們</h4>
                    {contactList.map((item, index) => {
                        return (
                            <li className='footer-contact-items' key={index}>
                                <a href={item.href} target={item.target} rel={item.rel}>
                                    {item.title}
                                </a>
                            </li>
                        )
                    })}
                    <li className='footer-contact-items'>
                        <br />
                        <span>
                            服務時間：周一至週五 <time>09:00</time> — <time>21:00</time> (GTM+8)
                        </span>
                    </li>
                </ul>
                <div className='media-payment-container'>
                    <h4>社群媒體</h4>
                    <ul className='footer-media-content'>
                        <li className='footer-media-items'>
                            <a
                                href='https://www.instagram.com/'
                                className='instagram-link'
                                target='_blank'
                                rel='noopener noreferrer'
                                aria-label='instagram-link'
                            >
                                <InstagramIcon />
                            </a>
                        </li>
                        <li className='footer-media-items'>
                            <a
                                href='https://www.facebook.com/'
                                className='facebook-link'
                                target='_blank'
                                rel='noopener noreferrer'
                                aria-label='facebook-link'
                            >
                                <FacebookIcon />
                            </a>
                        </li>
                        <li className='footer-media-items'>
                            <a
                                href='https://twitter.com/'
                                className='twitter-link'
                                target='_blank'
                                rel='noopener noreferrer'
                                aria-label='twitter-link'

                            >
                                <TwitterIcon />
                            </a>
                        </li>
                        <li className='footer-media-items'>
                            <a
                                href='https://www.youtube.com/'
                                className='youtube-link'
                                target='_blank'
                                rel='noopener noreferrer'
                                aria-label='youtube-link'

                            >
                                <YoutubeIcon />
                            </a>
                        </li>
                        <li className='footer-media-items'>
                            <a
                                href='https://www.twitch.tv/'
                                className='twitch-link'
                                target='_blank'
                                rel='noopener noreferrer'
                                aria-label='twitch-link'

                            >
                                <TwitchIcon />
                            </a>
                        </li>
                        <li className='footer-media-items'>
                            <a
                                href='https://line.me/'
                                className='line-link'
                                target='_blank'
                                rel='noopener noreferrer'
                                aria-label='line-link'

                            >
                                <LineIcon />
                            </a>
                        </li>
                        <li className='footer-media-items'>
                            <a
                                href='https://tw.linkedin.com/'
                                className='linkedin-link'
                                target='_blank'
                                rel='noopener noreferrer'
                                aria-label='linkedin-link'

                            >
                                <LinkedinIcon />
                            </a>
                        </li>
                    </ul>
                    <h4>我們接受</h4>
                    <ul className='footer-payment-content'>
                        <li className='footer-payment-items'>
                            <img src={payment} alt='payment' />
                        </li>
                    </ul>
                </div>
            </div>
            <small className='footer-non-commercial-small'>
                This site is for non-commercial use only If it causes copyright issues, please write to me and I will
                replace it immediately
            </small>
            <small className='footer-bottom-small'>Copyright ©2023 ORIGINTENNIS-DEMO All Rights Reserved</small>
        </footer>
    )
}

export default Footer
