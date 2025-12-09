import React, { useEffect, useState, useRef } from "react";
import useEconomyStore from "../store/useEconomyStore";
import useUpdateData from "../hooks/useUpdateData";
import type { CategoryData } from "../store/useEconomyStore";
import { fetchNui } from "../utils/fetchNui";
import playSound from "../utils/playSound";
// import { debugData } from "../utils/debugData";

// debugData([
//     {
//         event: 'economyData',
//         data: {
//             show: true,
//         }
//     },
//     {
//         event: 'openPriceList',
//         data: {
//             show: false,
//         }
//     },
//     {
//         event: 'economyCategoryData',
//         data: {
//             category: {
//                 'item1': {
//                     itemName: 'item1',
//                     label: 'HAMBURGER',
//                     sub: 'Ăn cho vui chứ no đéo đâu.',
//                     price: 100,
//                     imgUrl: 'https://cdn.watermelonstudio.tech/uploads/ws/noimg.svg',
//                     status: false,
//                 },
//                 'item2': {
//                     itemName: 'item2',
//                     label: 'PIZZA',
//                     sub: 'Ăn cho vui chứ no đéo đâu.',
//                     price: 100000,
//                     imgUrl: 'https://cdn.watermelonstudio.tech/uploads/ws/noimg.svg',
//                     status: true,
//                 },
//             }
//         }
//     }
// ]);

const Economy: React.FC = React.memo(() => {
    const { economyData, economyCategoryData, setEconomyData, setEconomyCategoryData, cartData, increaseCount, decreaseCount, clearCart, closeEconomy, addToCart, setCount, openPriceList, setOpenPriceList, closePriceList } = useEconomyStore();
    const totalPrice = useEconomyStore((s) => s.getTotalPrice());
    const [displayedTotal, setDisplayedTotal] = useState(0);
    const prevTotalRef = useRef(totalPrice);

    useUpdateData({
        economyData: setEconomyData,
        economyCategoryData: setEconomyCategoryData,
        openPriceList: setOpenPriceList,
    })

    const handleAddToCart = (categoryData: CategoryData) => {
        addToCart(categoryData);
        playSound('./sound/click.mp3', 0.1);
    }

    useEffect(() => {
        let start = prevTotalRef.current;
        const end = totalPrice;
        if (start === end) return;

        const duration = 800;
        const frameRate = 60;
        const totalFrames = Math.round((duration / 1000) * frameRate);
        const increment = (end - start) / totalFrames;

        let currentFrame = 0;

        const animate = () => {
            currentFrame++;
            start += increment;
            setDisplayedTotal(Math.round(start));

            if (currentFrame < totalFrames) {
                requestAnimationFrame(animate);
            } else {
                setDisplayedTotal(end);
            }
        };

        requestAnimationFrame(animate);

        prevTotalRef.current = end;
    }, [totalPrice]);

    const handleIncreaseCount = () => {
        increaseCount();
        playSound('./sound/click.mp3', 0.1);
    }

    const handleDecreaseCount = () => {
        decreaseCount();
        playSound('./sound/click.mp3', 0.1);
    }

    const handleSell = (item: string, count: number) => {
        fetchNui('sellItem', { item: item, count: count });
        clearCart();
        playSound('./sound/click.mp3', 0.1);
    }

    const handleSellAll = (item: string) => {
        fetchNui('sellItemAll', { item: item });
        clearCart();
        playSound('./sound/click.mp3', 0.1);
    }

    const handleCloseEconomy = (sound: boolean) => {
        closeEconomy();
        if(!sound) return; 
        playSound('./sound/click.mp3', 0.1);
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                if (openPriceList.show) {
                    closePriceList();
                    fetchNui('closeEconomy');
                    return;
                }
                if (economyData.show) {
                    handleCloseEconomy(false);
                    fetchNui('closeEconomy');
                    return;
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [openPriceList.show, economyData.show]);

    return (
        <>
            {economyData.show && (
                <div className="w-[112.375rem] h-[49.625rem] border-[0.0276rem] border-solid border-[#DC143C99] bg-[linear-gradient(180deg,_rgba(34,_14,_6,_0.80)_0%,_rgba(34,_14,_6,_0.80)_100%)] absolute flex items-center justify-center animation-openShop">
                    {/* header */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="67" height="67" viewBox="0 0 67 67" fill="none" className="w-[4.13775rem] h-[4.13775rem] absolute top-[2.66rem] left-[3.19rem]">
                        <rect y="0.00012207" width="66.2041" height="66.2041" fill="#5C1313" fill-opacity="0.45" />
                        <rect x="11.0332" y="55.1702" width="44.1361" height="44.1361" transform="rotate(-90 11.0332 55.1702)" fill="#DC143C" fill-opacity="0.05" />
                        <rect x="11.0332" y="55.1702" width="44.1361" height="44.1361" transform="rotate(-90 11.0332 55.1702)" fill="url(#paint0_radial_24_4375)" fill-opacity="0.55" />
                        <rect x="11.5159" y="54.6874" width="43.1706" height="43.1706" transform="rotate(-90 11.5159 54.6874)" stroke="#DC143C" stroke-opacity="0.1" stroke-width="0.965476" />
                        <mask id="mask0_24_4375" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="12" y="12" width="43" height="43">
                            <rect x="12.1377" y="12.1373" width="41.9292" height="41.9292" fill="#D9D9D9" />
                        </mask>
                        <g mask="url(#mask0_24_4375)">
                            <path d="M22.1375 21.99C22.3884 20.9865 22.5138 20.4847 22.8879 20.1926C23.2621 19.9005 23.7793 19.9005 24.8136 19.9005H39.8156C40.85 19.9005 41.3672 19.9005 41.7413 20.1926C42.1155 20.4847 42.2409 20.9865 42.4918 21.99L44.1518 28.6303C44.2854 29.1646 44.3522 29.4317 44.3375 29.6487C44.2993 30.2114 43.9224 30.6941 43.3858 30.8676C43.1789 30.9345 42.8971 30.9345 42.3336 30.9345C41.5983 30.9345 41.2306 30.9345 40.9218 30.8626C40.0567 30.6611 39.3416 30.0552 39.0006 29.235C38.8788 28.9423 38.8198 28.5878 38.7016 27.8789C38.6686 27.6805 38.652 27.5814 38.6333 27.5553C38.5783 27.4787 38.4643 27.4787 38.4092 27.5553C38.3905 27.5814 38.374 27.6805 38.3409 27.8789L38.2284 28.5537C38.2165 28.6252 38.2106 28.661 38.2046 28.6923C37.9612 29.9698 36.8587 30.9037 35.5586 30.9338C35.5267 30.9345 35.4905 30.9345 35.4179 30.9345C35.3454 30.9345 35.3092 30.9345 35.2773 30.9338C33.9772 30.9037 32.8747 29.9698 32.6313 28.6923C32.6253 28.661 32.6194 28.6252 32.6075 28.5537L32.495 27.8789C32.4619 27.6805 32.4454 27.5814 32.4267 27.5553C32.3716 27.4787 32.2576 27.4787 32.2026 27.5553C32.1839 27.5814 32.1673 27.6805 32.1343 27.8789L32.0218 28.5537C32.0099 28.6252 32.0039 28.661 31.998 28.6923C31.7546 29.9698 30.6521 30.9037 29.352 30.9338C29.3201 30.9345 29.2838 30.9345 29.2113 30.9345C29.1388 30.9345 29.1025 30.9345 29.0706 30.9338C27.7706 30.9037 26.6681 29.9698 26.4247 28.6923C26.4187 28.661 26.4127 28.6252 26.4008 28.5537L26.2884 27.8789C26.2553 27.6805 26.2388 27.5814 26.22 27.5553C26.165 27.4787 26.051 27.4787 25.996 27.5553C25.9772 27.5814 25.9607 27.6805 25.9276 27.8789C25.8095 28.5878 25.7504 28.9423 25.6287 29.235C25.2877 30.0552 24.5725 30.6611 23.7074 30.8626C23.3986 30.9345 23.031 30.9345 22.2956 30.9345C21.7321 30.9345 21.4504 30.9345 21.2435 30.8676C20.7069 30.6941 20.33 30.2114 20.2918 29.6487C20.2771 29.4317 20.3438 29.1646 20.4774 28.6303L22.1375 21.99Z" fill="#DC143C" />
                            <path d="M38.5215 31.9349C39.0788 32.3835 39.7357 32.7104 40.4521 32.8773C40.9259 32.9876 41.4395 33.002 41.9414 33.0033C41.9656 33.5838 41.9688 34.2652 41.9688 35.0717V43.348C41.9688 44.6479 41.9681 45.2986 41.5645 45.7025C41.1605 46.1062 40.51 46.1058 39.21 46.1058H35.0723V40.5883C35.0717 39.8271 34.4546 39.2095 33.6934 39.2094H30.9346C30.1735 39.2097 29.5563 39.8272 29.5557 40.5883V46.1058H25.418C24.1176 46.1058 23.4665 46.1065 23.0625 45.7025C22.6587 45.2986 22.6592 44.648 22.6592 43.348V35.0717C22.6592 34.2651 22.6625 33.5838 22.6865 33.0033C23.1887 33.002 23.7027 32.9878 24.1768 32.8773C24.893 32.7104 25.5493 32.3834 26.1064 31.9349C26.9122 32.584 27.9273 32.9769 29.0225 33.0023C29.0839 33.0037 29.1497 33.0033 29.2109 33.0033C29.2722 33.0033 29.338 33.0037 29.3994 33.0023C30.4941 32.9769 31.5089 32.5845 32.3145 31.9359C33.1201 32.5844 34.1348 32.977 35.2295 33.0023C35.291 33.0037 35.3566 33.0033 35.418 33.0033C35.4794 33.0033 35.5449 33.0037 35.6064 33.0023C36.7014 32.9769 37.7158 32.5838 38.5215 31.9349Z" fill="#DC143C" />
                        </g>
                        <path d="M0 0.00012207H11.034L0 11.0341V0.00012207Z" fill="#DC143C" />
                        <path d="M66.1523 66.1528H52.9631L66.1523 52.9636V66.1528Z" fill="#DC143C" />
                        <path d="M0 66.2041L13.2408 66.2041L-9.64624e-07 55.1701L0 66.2041Z" fill="#DC143C" fill-opacity="0.2" />
                        <path d="M66.204 0L51.86 1.254e-06L66.2041 15.4476L66.204 0Z" fill="#DC143C" fill-opacity="0.2" />
                        <defs>
                            <radialGradient id="paint0_radial_24_4375" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(33.235 77.2382) rotate(-90) scale(77.0033 86.5048)">
                                <stop stop-color="#DC143C" />
                                <stop offset="0.392791" stop-color="#DC143C" stop-opacity="0" />
                            </radialGradient>
                        </defs>
                    </svg>
                    <div className="text-[#DC143C] text-[2.55763rem] font-medium absolute left-[8.62rem] top-[2.31rem]">CHỢ TRỜI</div>
                    <div className="text-[#fa5677] text-[0.87694rem] italic font-normal absolute left-[8.62rem] top-[5.67rem]">Cái gì bán được thì bán cái đó.</div>
                    {/* close btn */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewBox="0 0 58 58" fill="none" className="w-[3.62056rem] h-[3.62056rem] absolute top-[1.12rem] right-[1.12rem] btn-hover" onClick={() => handleCloseEconomy(true)}>
                        <rect y="0.00012207" width="57.9286" height="57.9286" fill="#280B0B" fill-opacity="0.45" />
                        <rect x="9.65527" y="48.2739" width="38.619" height="38.619" transform="rotate(-90 9.65527 48.2739)" fill="#C94242" fill-opacity="0.05" />
                        <rect x="9.65527" y="48.2739" width="38.619" height="38.619" transform="rotate(-90 9.65527 48.2739)" fill="url(#paint0_radial_24_4357)" fill-opacity="0.55" />
                        <rect x="10.138" y="47.7912" width="37.6536" height="37.6536" transform="rotate(-90 10.138 47.7912)" stroke="#C94242" stroke-opacity="0.1" stroke-width="0.965476" />
                        <mask id="mask0_24_4357" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="10" y="10" width="38" height="38">
                            <rect x="10.6221" y="10.6201" width="36.6881" height="36.6881" fill="#D9D9D9" />
                        </mask>
                        <g mask="url(#mask0_24_4357)">
                            <path d="M39.999 39.9982H17.9307V17.9308H39.999V39.9982ZM28.9639 27.0148L25.0352 23.0851L23.085 25.0353L27.0146 28.965L23.0859 32.8937L25.0361 34.8439L28.9648 30.9152L32.8936 34.8439L34.8428 32.8937L30.9141 28.965L34.8447 25.0353L32.8945 23.0851L28.9639 27.0148Z" fill="#C94242" />
                        </g>
                        <path d="M0 0.00012207H9.65476L0 9.65488V0.00012207Z" fill="#C94242" />
                        <path d="M57.8838 57.8838H46.3432L57.8838 46.3432V57.8838Z" fill="#C94242" />
                        <path d="M0 57.9285L11.5857 57.9285L-8.44046e-07 48.2737L0 57.9285Z" fill="#C94242" fill-opacity="0.2" />
                        <path d="M57.9286 0L45.3776 1.09725e-06L57.9287 13.5167L57.9286 0Z" fill="#C94242" fill-opacity="0.2" />
                        <defs>
                            <radialGradient id="paint0_radial_24_4357" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(29.0818 67.5834) rotate(-90) scale(67.3779 75.6917)">
                                <stop stop-color="#C94242" />
                                <stop offset="0.392791" stop-color="#C94242" stop-opacity="0" />
                            </radialGradient>
                        </defs>
                    </svg>
                    {/* List */}
                    <div className="flex w-[57.5rem] h-[38.8125rem] absolute left-[3.19rem] top-[8.69rem] items-start content-start gap-3.5 flex-shrink-0 flex-wrap overflow-auto customsrollbar">
                        {Object.values(economyCategoryData.category).map((category, index) => (
                            <div key={index} className="w-[13.54625rem] h-[18.96469rem] border-[0.2rem] border-solid border-[#DC143C40] bg-[linear-gradient(90deg,_rgba(77,_32,_13,_0.25)_0%,_rgba(40,_17,_7,_0.50)_100%)] relative flex items-center justify-center btn-hover" onClick={() => handleAddToCart(category)}>
                                <div className="w-[10.837rem] h-[10.837rem] absolute top-[1.35rem] flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="174" height="174" viewBox="0 0 174 174" fill="none" className="w-full h-full absolute">
                                        <rect width="173.392" height="173.392" fill="#5C1313" fill-opacity="0.45" />
                                        <path d="M0 0H28.8986L0 28.8986V0Z" fill="#DC143C" />
                                        <path d="M173.253 173.258H138.71L173.253 138.715V173.258Z" fill="#DC143C" />
                                        <path d="M0 173.392L34.6783 173.392L-2.5264e-06 144.493L0 173.392Z" fill="#DC143C" fill-opacity="0.2" />
                                        <path d="M173.391 0.00012207L135.824 0.000125355L173.392 40.4582L173.391 0.00012207Z" fill="#DC143C" fill-opacity="0.2" />
                                    </svg>
                                    <img src={category.imgUrl} onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn.watermelonstudio.tech/uploads/ws/noimg.svg'; }} alt={category.itemName} className="w-32 absolute" />
                                </div>
                                <div className="text-[#DC143C] text-[1.22538rem] font-medium absolute top-[12.54rem] uppercase">{category.label}</div>
                                <div className="text-[#fa5677] text-[0.49506rem] italic font-normal absolute top-[14rem]">{category.sub}</div>
                                <div className="w-[10.61119rem] h-[1.80619rem] flex items-center justify-center text-center bg-[#DC143C] text-[#5C1313] text-[1.12888rem] not-italic font-semibold leading-[100%] absolute bottom-[1.35rem]">{category.price.toLocaleString()}$</div>
                            </div>
                        ))}
                    </div>
                    {/* Bill */}
                    <div className="text-[#DC143C] text-[2.55763rem] font-medium absolute left-[69.25rem] top-[2.31rem]">HOÁ ĐƠN</div>
                    <div className="text-[#fa5677] text-[0.87694rem] italic font-normal absolute left-[71rem] top-[5.67rem]">Tổng tiền bán hàng</div>
                    <div className="w-[23.25rem] h-[32rem] flex items-center justify-center absolute top-[8.69rem] left-[63.38rem] bg-[#5c131354]">
                        {/* <img src="https://cdn.watermelonstudio.tech/uploads/MnP-interface/bg-bill-01.svg" className="w-full h-full absolute" /> */}
                        {cartData.itemName === '' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50px" height="50px" className="w-36 h-36 absolute"><path d="M49 15H1V3h48V15zM3 17v31h44V17H3zM32.502 25H17.498c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5h15.004c1.381 0 2.5 1.119 2.5 2.5S33.883 25 32.502 25z" fill="#DC143C" /></svg>
                        ) : (
                            <>
                                <div className="w-[15.125rem] h-[15.125rem] flex items-center justify-center absolute top-[2.12rem]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="242" height="242" viewBox="0 0 242 242" fill="none" className="w-full h-full absolute">
                                        <rect width="241.997" height="241.997" fill="#5C1313" fill-opacity="0.45" />
                                        <path d="M0 0H40.3329L0 40.3329V0Z" fill="#DC143C" />
                                        <path d="M241.807 241.811H193.596L241.807 193.6V241.811Z" fill="#DC143C" />
                                        <path d="M0 241.997L48.3995 241.997L-3.52601e-06 201.664L0 241.997Z" fill="#DC143C" fill-opacity="0.2" />
                                        <path d="M242 0L189.568 4.58377e-06L242 56.466L242 0Z" fill="#DC143C" fill-opacity="0.2" />
                                    </svg>
                                    <img src={cartData.imgUrl} onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn.watermelonstudio.tech/uploads/ws/noimg.svg'; }} className="w-[11rem] h-[11rem] absolute" />
                                </div>
                                <div className="text-[#DC143C] text-[1.875rem] font-medium absolute top-[18.44rem]">{cartData.label}</div>
                                <div className="text-[#DC143C] text-[1.24994rem] font-medium absolute top-[22.81rem]">GIÁ: <span className="text-white text-[1.24994rem] font-medium">{cartData.price.toLocaleString()}$</span></div>
                                <div className="text-[#DC143C] text-[1.24994rem] font-medium absolute bottom-4">GIÁ: <span className="text-white text-[1.24994rem] font-medium">{displayedTotal.toLocaleString()}$</span></div>
                                <div className="inline-flex items-center gap-[0.3125rem] absolute top-[25.25rem]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none" className="w-[2.49988rem] h-[2.49988rem] btn-hover" onClick={() => handleDecreaseCount()}>
                                        <rect width="39.9983" height="39.9983" fill="#5C1313" fill-opacity="0.45" />
                                        <rect x="6.66699" y="33.3315" width="26.6655" height="26.6655" transform="rotate(-90 6.66699 33.3315)" fill="#C8D7EF" fill-opacity="0.05" />
                                        <rect x="6.66699" y="33.3315" width="26.6655" height="26.6655" transform="rotate(-90 6.66699 33.3315)" fill="url(#paint0_radial_350_289)" fill-opacity="0.55" />
                                        <rect x="7.00031" y="32.9982" width="25.9989" height="25.9989" transform="rotate(-90 7.00031 32.9982)" stroke="#DC143C" stroke-opacity="0.1" stroke-width="0.666638" />
                                        <mask id="mask0_350_289" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="7" y="6" width="26" height="27">
                                            <rect x="7" y="6.98438" width="25.3323" height="25.3323" fill="#D9D9D9" />
                                        </mask>
                                        <g mask="url(#mask0_350_289)">
                                            <path d="M12 21.9844V17.9844H28V21.9844H12Z" fill="#DC143C" />
                                        </g>
                                        <path d="M0 0H6.66638L0 6.66638V0Z" fill="#DC143C" />
                                        <path d="M39.9678 39.9673H31.9993L39.9678 31.9988V39.9673Z" fill="#DC143C" />
                                        <path d="M0 39.998L7.99966 39.998L-5.82794e-07 33.3317L0 39.998Z" fill="#DC143C" fill-opacity="0.2" />
                                        <path d="M39.998 0L31.3318 7.57625e-07L39.998 9.33294L39.998 0Z" fill="#DC143C" fill-opacity="0.2" />
                                        <defs>
                                            <radialGradient id="paint0_radial_350_289" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(20.0806 46.6643) rotate(-90) scale(46.5228 52.2633)">
                                                <stop stop-color="#DC143C" />
                                                <stop offset="0.392791" stop-color="#DC143C" stop-opacity="0" />
                                            </radialGradient>
                                        </defs>
                                    </svg>
                                    <div className="w-[8.625rem] h-[2.5rem] relative flex items-center justify-center bg-[#5c131354]">
                                        {/* <img src="https://cdn.watermelonstudio.tech/uploads/MnP-interface/bg-bill-input-01.svg" className="w-full h-full absolute" /> */}
                                        <input
                                            type="number"
                                            className="w-full h-full absolute border-none outline-none text-center bg-transparent text-[#DC143C] text-[1.24994rem] font-medium placeholder:text-[#fa5677b3] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                                            placeholder="1-999"
                                            value={cartData.count}
                                            onChange={(e) => {
                                                let newAmount = parseInt(e.target.value) || 0;
                                                if (newAmount < 1) newAmount = 1;
                                                if (newAmount < 1) newAmount = 1;
                                                if (newAmount > 999) newAmount = 999;
                                                setCount(newAmount);
                                            }}
                                        />
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none" className="w-[2.49988rem] h-[2.49988rem] btn-hover" onClick={() => handleIncreaseCount()}>
                                        <rect width="39.9983" height="39.9983" fill="#5C1313" fill-opacity="0.45" />
                                        <rect x="6.66699" y="33.3315" width="26.6655" height="26.6655" transform="rotate(-90 6.66699 33.3315)" fill="#C8D7EF" fill-opacity="0.05" />
                                        <rect x="6.66699" y="33.3315" width="26.6655" height="26.6655" transform="rotate(-90 6.66699 33.3315)" fill="url(#paint0_radial_350_288)" fill-opacity="0.55" />
                                        <rect x="7.00031" y="32.9982" width="25.9989" height="25.9989" transform="rotate(-90 7.00031 32.9982)" stroke="#DC143C" stroke-opacity="0.1" stroke-width="0.666638" />
                                        <mask id="mask0_350_288" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="7" y="7" width="26" height="26">
                                            <rect x="7.33203" y="7.33301" width="25.3323" height="25.3323" fill="#D9D9D9" />
                                        </mask>
                                        <g mask="url(#mask0_350_288)">
                                            <path d="M12 22V18H28V22H12Z" fill="#DC143C" />
                                            <path d="M18 12L22 12L22 28L18 28L18 12Z" fill="#DC143C" />
                                        </g>
                                        <path d="M0 0H6.66638L0 6.66638V0Z" fill="#DC143C" />
                                        <path d="M39.9678 39.9673H31.9993L39.9678 31.9988V39.9673Z" fill="#DC143C" />
                                        <path d="M0 39.998L7.99966 39.998L-5.82794e-07 33.3317L0 39.998Z" fill="#DC143C" fill-opacity="0.2" />
                                        <path d="M39.998 0L31.3318 7.57625e-07L39.998 9.33294L39.998 0Z" fill="#DC143C" fill-opacity="0.2" />
                                        <defs>
                                            <radialGradient id="paint0_radial_350_288" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(20.0806 46.6643) rotate(-90) scale(46.5228 52.2633)">
                                                <stop stop-color="#DC143C" />
                                                <stop offset="0.392791" stop-color="#DC143C" stop-opacity="0" />
                                            </radialGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </>
                        )
                        }
                    </div >
                    <div className="w-[11.125rem] h-[3.625rem] flex items-center justify-center absolute left-[63.38rem] bottom-[2.19rem] btn-hover" onClick={() => handleSell(cartData.itemName, cartData.count)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="178" height="58" viewBox="0 0 178 58" fill="none" className="w-full h-full absolute">
                            <rect width="178" height="58" fill="#5C1313" fill-opacity="0.45" />
                            <path d="M0 0H10L0 10V0Z" fill="#DC143C" />
                            <path d="M178 58L168 58L178 48L178 58Z" fill="#DC143C" />
                            <path d="M0 58L12 58L-8.74228e-07 48L0 58Z" fill="#DC143C" fill-opacity="0.2" />
                            <path d="M178 0L166 0L178 10L178 0Z" fill="#DC143C" fill-opacity="0.2" />
                        </svg>
                        <div className="text-[#DC143C] text-[1.80525rem] font-medium absolute">BÁN</div>
                    </div>
                    <div className="w-[11.125rem] h-[3.625rem] flex items-center justify-center absolute right-[25.75rem] bottom-[2.19rem] btn-hover" onClick={() => handleSellAll(cartData.itemName)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="178" height="58" viewBox="0 0 178 58" fill="none" className="w-full h-full absolute">
                            <rect width="178" height="58" fill="#5C1313" fill-opacity="0.45" />
                            <path d="M0 0H10L0 10V0Z" fill="#DC143C" />
                            <path d="M178 58L168 58L178 48L178 58Z" fill="#DC143C" />
                            <path d="M0 58L12 58L-8.74228e-07 48L0 58Z" fill="#DC143C" fill-opacity="0.2" />
                            <path d="M178 0L166 0L178 10L178 0Z" fill="#DC143C" fill-opacity="0.2" />
                        </svg>
                        <div className="text-[#DC143C] text-[1.80525rem] font-medium absolute">BÁN HẾT</div>
                    </div>
                    {/* economy */}
                    <div className="text-[#DC143C] text-[2.55763rem] font-medium absolute right-[6.69rem] top-[2.31rem]">BIẾN ĐỘNG</div>
                    <div className="text-[#fa5677] text-[0.87694rem] italic font-normal absolute right-[8.5rem] top-[5.67rem]">Biến động giá thị thường</div>
                    <div className="w-[19.375rem] h-[39.9375rem] border-[0.0625rem] border-solid border-[#a0354b99] absolute top-[8.12rem] right-[3.88rem] flex items-center justify-center">
                        <div className="w-[18.5rem] h-[38.4rem] overflow-y-auto customsrollbar">
                            {Object.values(economyCategoryData.category).map((category, index) => (
                                <div key={index} className="w-[18.25rem] h-[3.8125rem] border-[0.0625rem] border-solid border-[#a10c2a99] bg-[#5c131354] mb-2 relative flex items-center justify-center">
                                    <div className="w-[3.25rem] h-[3.25rem] flex items-center justify-center absolute left-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none" className="w-full h-full absolute">
                                            <rect width="52" height="52" fill="#5C1313" fill-opacity="0.45" />
                                            <path d="M0 0H8.66667L0 8.66667V0Z" fill="#DC143C" />
                                            <path d="M51.959 51.9604H41.5995L51.959 41.601V51.9604Z" fill="#DC143C" />
                                            <path d="M0 52L10.4 52L-7.57664e-07 43.3333L0 52Z" fill="#DC143C" fill-opacity="0.2" />
                                            <path d="M51.9999 0L40.7334 9.84954e-07L52 12.1333L51.9999 0Z" fill="#DC143C" fill-opacity="0.2" />
                                        </svg>
                                        <img src={category.imgUrl} onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn.watermelonstudio.tech/uploads/ws/noimg.svg'; }} className="w-[2.4rem] h-[2.4rem]" />
                                    </div>
                                    <div className="text-[#DC143C] text-[1.22538rem] font-medium absolute left-[3.84rem] top-[0.31rem]">{category.label}</div>
                                    <div className="text-white text-[0.9375rem] italic font-medium absolute left-[3.84rem] top-[2.06rem]">{category.price.toLocaleString()}$</div>
                                    {category.status ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="14" viewBox="0 0 24 14" fill="none" className="w-[1.50056rem] h-[0.87519rem] absolute right-4">
                                            <path d="M10.5922 0.585742C11.3734 -0.195508 12.6422 -0.195508 13.4234 0.585742L23.4234 10.5857C24.2047 11.367 24.2047 12.6357 23.4234 13.417C22.6422 14.1982 21.3734 14.1982 20.5922 13.417L12.0047 4.82949L3.41719 13.4107C2.63594 14.192 1.36719 14.192 0.585938 13.4107C-0.195312 12.6295 -0.195312 11.3607 0.585938 10.5795L10.5859 0.579492L10.5922 0.585742Z" fill="#4D7AED" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="14" viewBox="0 0 24 14" fill="none" className="w-[1.50056rem] h-[0.87519rem] absolute right-4">
                                            <path d="M10.5922 13.4172C11.3734 14.1984 12.6422 14.1984 13.4234 13.4172L23.4234 3.41719C24.2047 2.63594 24.2047 1.36719 23.4234 0.585938C22.6422 -0.195312 21.3734 -0.195312 20.5922 0.585938L12.0047 9.17344L3.41719 0.592187C2.63594 -0.189063 1.36719 -0.189063 0.585938 0.592187C-0.195312 1.37344 -0.195312 2.64219 0.585938 3.42344L10.5859 13.4234L10.5922 13.4172Z" fill="#C94242" />
                                        </svg>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {openPriceList.show && (
                <>
                    <div className="w-[22.5rem] h-[48.4375rem] border-[0.1293rem] border-solid border-[#a0354b99] bg-[#240101b4] flex items-center justify-center absolute animation-openShop">
                        <div className="text-[#DC143C] text-[2.55763rem] font-medium absolute top-[1.31rem]">BIẾN ĐỘNG</div>
                        <div className="text-[#fa5677] text-[0.87694rem] italic font-normal absolute top-[4.67rem]">Biến động giá thị thường</div>
                        <div className="w-[19.375rem] h-[39.9375rem] border-[0.0625rem] border-solid border-[#a0354b99] absolute top-[7rem] flex items-center justify-center">
                            <div className="w-[18.5rem] h-[38.4rem] overflow-y-auto customsrollbar">
                                {Object.values(economyCategoryData.category).map((category, index) => (
                                    <div key={index} className="w-[18.25rem] h-[3.8125rem] border-[0.0625rem] border-solid border-[#a10c2a99] bg-[#5c131354] mb-2 relative flex items-center justify-center">
                                        <div className="w-[3.25rem] h-[3.25rem] flex items-center justify-center absolute left-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none" className="w-full h-full absolute">
                                                <rect width="52" height="52" fill="#5C1313" fill-opacity="0.45" />
                                                <path d="M0 0H8.66667L0 8.66667V0Z" fill="#DC143C" />
                                                <path d="M51.959 51.9604H41.5995L51.959 41.601V51.9604Z" fill="#DC143C" />
                                                <path d="M0 52L10.4 52L-7.57664e-07 43.3333L0 52Z" fill="#DC143C" fill-opacity="0.2" />
                                                <path d="M51.9999 0L40.7334 9.84954e-07L52 12.1333L51.9999 0Z" fill="#DC143C" fill-opacity="0.2" />
                                            </svg>
                                            <img src={category.imgUrl} onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn.watermelonstudio.tech/uploads/ws/noimg.svg'; }} className="w-[2.4rem] h-[2.4rem]" />
                                        </div>
                                        <div className="text-[#DC143C] text-[1.22538rem] font-medium absolute left-[3.84rem] top-[0.31rem]">{category.label}</div>
                                        <div className="text-white text-[0.9375rem] italic font-medium absolute left-[3.84rem] top-[2.06rem]">{category.price.toLocaleString()}$</div>
                                        {category.status ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="14" viewBox="0 0 24 14" fill="none" className="w-[1.50056rem] h-[0.87519rem] absolute right-4">
                                                <path d="M10.5922 0.585742C11.3734 -0.195508 12.6422 -0.195508 13.4234 0.585742L23.4234 10.5857C24.2047 11.367 24.2047 12.6357 23.4234 13.417C22.6422 14.1982 21.3734 14.1982 20.5922 13.417L12.0047 4.82949L3.41719 13.4107C2.63594 14.192 1.36719 14.192 0.585938 13.4107C-0.195312 12.6295 -0.195312 11.3607 0.585938 10.5795L10.5859 0.579492L10.5922 0.585742Z" fill="#4D7AED" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="14" viewBox="0 0 24 14" fill="none" className="w-[1.50056rem] h-[0.87519rem] absolute right-4">
                                                <path d="M10.5922 13.4172C11.3734 14.1984 12.6422 14.1984 13.4234 13.4172L23.4234 3.41719C24.2047 2.63594 24.2047 1.36719 23.4234 0.585938C22.6422 -0.195312 21.3734 -0.195312 20.5922 0.585938L12.0047 9.17344L3.41719 0.592187C2.63594 -0.189063 1.36719 -0.189063 0.585938 0.592187C-0.195312 1.37344 -0.195312 2.64219 0.585938 3.42344L10.5859 13.4234L10.5922 13.4172Z" fill="#C94242" />
                                            </svg>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
});

export default Economy;