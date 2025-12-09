import React, { useEffect, useState, useRef } from "react";
import useShopStore from "../store/useShopStore";
import useUpdateData from "../hooks/useUpdateData";
import type { CategoryData, CartData } from "../store/useShopStore";
import playSound from "../utils/playSound";
import { fetchNui } from "../utils/fetchNui";


const Shop: React.FC = React.memo(() => {

    const { shopData, shopCategoryData, setShopData, setShopCategoryData, cartData, increaseCount, decreaseCount, removeFromCart, clearCart, closeShop } = useShopStore();
    const addToCart = useShopStore((s) => s.addToCart);
    const totalPrice = useShopStore((s) => s.getTotalPrice());
    const [displayedTotal, setDisplayedTotal] = useState(0);
    const prevTotalRef = useRef(totalPrice);


    useUpdateData({
        shopData: setShopData,
        shopCategoryData: setShopCategoryData,
    })

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

    const handleAddToCart = (categoryData: CategoryData) => {
        addToCart(categoryData);
        playSound('./sound/click.mp3', 0.1);
    }

    const handleIncreaseCount = (itemName: string) => {
        increaseCount(itemName);
        playSound('./sound/click.mp3', 0.1);
    }

    const handleDecreaseCount = (itemName: string) => {
        decreaseCount(itemName);
        playSound('./sound/click.mp3', 0.1);
    }

    const handleRemoveFromCart = (itemName: string) => {
        removeFromCart(itemName);
        playSound('./sound/click.mp3', 0.1);
    }

    const handleBuy = (withType: 'bank' | 'cash', cartItem: CartData[]) => {
        if (cartItem.length === 0) return;
        cartItem.forEach((cart) => {
            fetchNui('buyItems', { itemName: cart.itemName, count: cart.count, type: withType, price: cart.price * cart.count });
        });
        clearCart();
        playSound('./sound/click.mp3', 0.3);
    }

    const handleCloseShop = (btn: boolean) => {
        closeShop();
        fetchNui('closeShop');
        if (btn) {
            playSound('./sound/click.mp3', 0.3);
        }
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && shopData.show) {
                handleCloseShop(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [shopData.show]);

    return (
        <>
            {
                shopData.show && (
                    <div className="w-[90.85819rem] h-[50.6875rem] border-[0.0276rem] border-solid border-[#EE2D2D99] bg-[#240000c5] absolute flex items-center justify-center animation-openShop">
                        {/* header */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="67" height="67" viewBox="0 0 67 67" fill="none" className="w-[4.13775rem] h-[4.13775rem] absolute top-[1.12rem] left-[1.12rem]">
                            <rect y="0.00012207" width="66.2041" height="66.2041" fill="#5C1313" fill-opacity="0.45" />
                            <rect x="11.0332" y="55.1702" width="44.1361" height="44.1361" transform="rotate(-90 11.0332 55.1702)" fill="#EE2D2D" fill-opacity="0.05" />
                            <rect x="11.0332" y="55.1702" width="44.1361" height="44.1361" transform="rotate(-90 11.0332 55.1702)" fill="url(#paint0_radial_24_4375)" fill-opacity="0.55" />
                            <rect x="11.5159" y="54.6874" width="43.1706" height="43.1706" transform="rotate(-90 11.5159 54.6874)" stroke="#EE2D2D" stroke-opacity="0.1" stroke-width="0.965476" />
                            <mask id="mask0_24_4375" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="12" y="12" width="43" height="43">
                                <rect x="12.1377" y="12.1373" width="41.9292" height="41.9292" fill="#D9D9D9" />
                            </mask>
                            <g mask="url(#mask0_24_4375)">
                                <path d="M22.1375 21.99C22.3884 20.9865 22.5138 20.4847 22.8879 20.1926C23.2621 19.9005 23.7793 19.9005 24.8136 19.9005H39.8156C40.85 19.9005 41.3672 19.9005 41.7413 20.1926C42.1155 20.4847 42.2409 20.9865 42.4918 21.99L44.1518 28.6303C44.2854 29.1646 44.3522 29.4317 44.3375 29.6487C44.2993 30.2114 43.9224 30.6941 43.3858 30.8676C43.1789 30.9345 42.8971 30.9345 42.3336 30.9345C41.5983 30.9345 41.2306 30.9345 40.9218 30.8626C40.0567 30.6611 39.3416 30.0552 39.0006 29.235C38.8788 28.9423 38.8198 28.5878 38.7016 27.8789C38.6686 27.6805 38.652 27.5814 38.6333 27.5553C38.5783 27.4787 38.4643 27.4787 38.4092 27.5553C38.3905 27.5814 38.374 27.6805 38.3409 27.8789L38.2284 28.5537C38.2165 28.6252 38.2106 28.661 38.2046 28.6923C37.9612 29.9698 36.8587 30.9037 35.5586 30.9338C35.5267 30.9345 35.4905 30.9345 35.4179 30.9345C35.3454 30.9345 35.3092 30.9345 35.2773 30.9338C33.9772 30.9037 32.8747 29.9698 32.6313 28.6923C32.6253 28.661 32.6194 28.6252 32.6075 28.5537L32.495 27.8789C32.4619 27.6805 32.4454 27.5814 32.4267 27.5553C32.3716 27.4787 32.2576 27.4787 32.2026 27.5553C32.1839 27.5814 32.1673 27.6805 32.1343 27.8789L32.0218 28.5537C32.0099 28.6252 32.0039 28.661 31.998 28.6923C31.7546 29.9698 30.6521 30.9037 29.352 30.9338C29.3201 30.9345 29.2838 30.9345 29.2113 30.9345C29.1388 30.9345 29.1025 30.9345 29.0706 30.9338C27.7706 30.9037 26.6681 29.9698 26.4247 28.6923C26.4187 28.661 26.4127 28.6252 26.4008 28.5537L26.2884 27.8789C26.2553 27.6805 26.2388 27.5814 26.22 27.5553C26.165 27.4787 26.051 27.4787 25.996 27.5553C25.9772 27.5814 25.9607 27.6805 25.9276 27.8789C25.8095 28.5878 25.7504 28.9423 25.6287 29.235C25.2877 30.0552 24.5725 30.6611 23.7074 30.8626C23.3986 30.9345 23.031 30.9345 22.2956 30.9345C21.7321 30.9345 21.4504 30.9345 21.2435 30.8676C20.7069 30.6941 20.33 30.2114 20.2918 29.6487C20.2771 29.4317 20.3438 29.1646 20.4774 28.6303L22.1375 21.99Z" fill="#EE2D2D" />
                                <path d="M38.5215 31.9349C39.0788 32.3835 39.7357 32.7104 40.4521 32.8773C40.9259 32.9876 41.4395 33.002 41.9414 33.0033C41.9656 33.5838 41.9688 34.2652 41.9688 35.0717V43.348C41.9688 44.6479 41.9681 45.2986 41.5645 45.7025C41.1605 46.1062 40.51 46.1058 39.21 46.1058H35.0723V40.5883C35.0717 39.8271 34.4546 39.2095 33.6934 39.2094H30.9346C30.1735 39.2097 29.5563 39.8272 29.5557 40.5883V46.1058H25.418C24.1176 46.1058 23.4665 46.1065 23.0625 45.7025C22.6587 45.2986 22.6592 44.648 22.6592 43.348V35.0717C22.6592 34.2651 22.6625 33.5838 22.6865 33.0033C23.1887 33.002 23.7027 32.9878 24.1768 32.8773C24.893 32.7104 25.5493 32.3834 26.1064 31.9349C26.9122 32.584 27.9273 32.9769 29.0225 33.0023C29.0839 33.0037 29.1497 33.0033 29.2109 33.0033C29.2722 33.0033 29.338 33.0037 29.3994 33.0023C30.4941 32.9769 31.5089 32.5845 32.3145 31.9359C33.1201 32.5844 34.1348 32.977 35.2295 33.0023C35.291 33.0037 35.3566 33.0033 35.418 33.0033C35.4794 33.0033 35.5449 33.0037 35.6064 33.0023C36.7014 32.9769 37.7158 32.5838 38.5215 31.9349Z" fill="#EE2D2D" />
                            </g>
                            <path d="M0 0.00012207H11.034L0 11.0341V0.00012207Z" fill="#EE2D2D" />
                            <path d="M66.1523 66.1528H52.9631L66.1523 52.9636V66.1528Z" fill="#EE2D2D" />
                            <path d="M0 66.2041L13.2408 66.2041L-9.64624e-07 55.1701L0 66.2041Z" fill="#EE2D2D" fill-opacity="0.2" />
                            <path d="M66.204 0L51.86 1.254e-06L66.2041 15.4476L66.204 0Z" fill="#EE2D2D" fill-opacity="0.2" />
                            <defs>
                                <radialGradient id="paint0_radial_24_4375" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(33.235 77.2382) rotate(-90) scale(77.0033 86.5048)">
                                    <stop stop-color="#EE2D2D" />
                                    <stop offset="0.392791" stop-color="#EE2D2D" stop-opacity="0" />
                                </radialGradient>
                            </defs>
                        </svg>
                        <div className="text-[#EE2D2D] text-[2.55763rem] font-medium absolute left-[6.56rem] top-[0.78rem]">{shopData.labelShopName}</div>
                        <div className="text-[#fa5677] text-[0.87694rem] italic font-normal absolute left-[6.56rem] top-[4.14rem]">{shopData.subShop}</div>
                        {/* close btn */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewBox="0 0 58 58" fill="none" className="w-[3.62056rem] h-[3.62056rem] absolute top-[1.12rem] right-[1.12rem] btn-hover" onClick={() => handleCloseShop(true)}>
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
                        {/* line eff */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="1418" height="683" viewBox="0 0 1418 683" fill="none" className="w-[88.61688rem] h-[42.67063rem] absolute bottom-[1.12rem]">
                            <rect width="4.13776" height="4.13776" fill="#fa5677" fill-opacity="0.75" />
                            <rect y="678.592" width="4.13776" height="4.13776" fill="#fa5677" fill-opacity="0.75" />
                            <rect x="5.51758" y="679.971" width="969.614" height="1.37925" fill="#fa5677" fill-opacity="0.25" />
                            <rect x="982.027" y="679.971" width="430.327" height="1.37925" fill="#fa5677" fill-opacity="0.25" />
                            <rect x="976.51" y="678.592" width="4.13776" height="4.13776" fill="#fa5677" fill-opacity="0.75" />
                            <rect x="982.027" y="1.37939" width="430.327" height="1.37925" fill="#fa5677" fill-opacity="0.25" />
                            <rect x="976.51" y="0.00012207" width="4.13776" height="4.13776" fill="#fa5677" fill-opacity="0.75" />
                            <rect x="1413.73" y="678.592" width="4.13776" height="4.13776" fill="#fa5677" fill-opacity="0.75" />
                            <rect x="1413.73" y="0.00012207" width="4.13776" height="4.13776" fill="#fa5677" fill-opacity="0.75" />
                            <rect x="5.51758" y="1.37939" width="969.614" height="1.37925" fill="#fa5677" fill-opacity="0.25" />
                            <rect width="671.696" height="1.37928" transform="matrix(-4.37114e-08 1 1 4.37114e-08 1415.11 5.51709)" fill="#fa5677" fill-opacity="0.25" />
                            <rect width="671.696" height="1.37928" transform="matrix(-4.37114e-08 1 1 4.37114e-08 977.89 5.51709)" fill="#fa5677" fill-opacity="0.25" />
                            <rect width="671.696" height="1.37928" transform="matrix(-4.37114e-08 1 1 4.37114e-08 1.37988 5.51709)" fill="#fa5677" fill-opacity="0.25" />
                        </svg>
                        {/* List */}
                        <div className="flex w-[57.5rem] h-[38.8125rem] absolute left-12 top-[8.88rem] items-start content-start gap-3.5 flex-shrink-0 flex-wrap overflow-auto customsrollbar">
                            {Object.values(shopCategoryData.category).map((category, index) => (
                                <div key={index} className="w-[13.54625rem] h-[18.96469rem] border-[0.2rem] border-solid border-[#EE2D2D40] bg-[linear-gradient(90deg,_rgba(77,_32,_13,_0.25)_0%,_rgba(40,_17,_7,_0.50)_100%)] relative flex items-center justify-center btn-hover" onClick={() => handleAddToCart(category)}>
                                    <div className="w-[10.837rem] h-[10.837rem] absolute top-[1.35rem] flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="174" height="174" viewBox="0 0 174 174" fill="none" className="w-full h-full absolute">
                                            <rect width="173.392" height="173.392" fill="#5C1313" fill-opacity="0.45" />
                                            <path d="M0 0H28.8986L0 28.8986V0Z" fill="#EE2D2D" />
                                            <path d="M173.253 173.258H138.71L173.253 138.715V173.258Z" fill="#EE2D2D" />
                                            <path d="M0 173.392L34.6783 173.392L-2.5264e-06 144.493L0 173.392Z" fill="#EE2D2D" fill-opacity="0.2" />
                                            <path d="M173.391 0.00012207L135.824 0.000125355L173.392 40.4582L173.391 0.00012207Z" fill="#EE2D2D" fill-opacity="0.2" />
                                        </svg>
                                        <img src={category.imgUrl} onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn.watermelonstudio.tech/uploads/ws/noimg.svg'; }} alt={category.itemName} className="w-32 absolute" />
                                    </div>
                                    <div className="text-[#EE2D2D] text-[1.22538rem] font-medium absolute top-[12.54rem] uppercase">{category.label}</div>
                                    <div className="text-[#fa5677] text-[0.49506rem] italic font-normal absolute top-[14rem]">{category.sub}</div>
                                    <div className="w-[10.61119rem] h-[1.80619rem] flex items-center justify-center text-center bg-[#EE2D2D] text-[#5C1313] text-[1.12888rem] not-italic font-semibold leading-[100%] absolute bottom-[1.35rem]">{category.price.toLocaleString()}$</div>
                                </div>
                            ))}
                        </div>
                        {/* cart */}
                        {cartData.cart.length === 0 ? (
                            <>
                                <div className="w-[24.3rem] h-[33.19rem] absolute top-[8.79rem] left-[64rem] flex items-center justify-center flex-col">
                                    <div className="text-[#EE2D2D] text-[2rem] font-medium uppercase">HÃY CHỌN SẢN PHẨM</div>
                                    <div className="text-[#fa5677] text-[1rem] italic font-normal">Chọn sản phẩm để mua sắm nào.</div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-[24.3rem] h-[33.19rem] gap-[0.431rem] items-start content-start flex flex-wrap absolute top-[8.79rem] left-[64rem] overflow-x-auto customsrollbar">
                                    {Object.values(cartData.cart).map((item, index) => (
                                        <div key={index} className="w-[23.79206rem] h-[5.17219rem] border-[0.0184rem] border-solid border-[#EE2D2D40] bg-[linear-gradient(90deg,_rgba(77,_32,_13,_0.25)_0%,_rgba(40,_17,_7,_0.50)_100%)] flex items-center justify-center relative">
                                            <div className="w-[4.13775rem] h-[4.13775rem] absolute left-[0.45rem] flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="67" height="67" viewBox="0 0 67 67" fill="none" className="w-full h-full absolute">
                                                    <rect width="66.2041" height="66.2041" fill="#5C1313" fill-opacity="0.45" />
                                                    <path d="M0 0H11.034L0 11.034V0Z" fill="#EE2D2D" />
                                                    <path d="M66.1504 66.1528H52.9612L66.1504 52.9636V66.1528Z" fill="#EE2D2D" />
                                                    <path d="M0 66.2041L13.2408 66.2041L-9.64624e-07 55.1701L0 66.2041Z" fill="#EE2D2D" fill-opacity="0.2" />
                                                    <path d="M66.204 0L51.86 1.254e-06L66.2041 15.4476L66.204 0Z" fill="#EE2D2D" fill-opacity="0.2" />
                                                </svg>
                                                <img src={item.imgUrl} onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn.watermelonstudio.tech/uploads/ws/noimg.svg'; }} className="w-12 absolute" />
                                            </div>
                                            <div className="text-[#EE2D2D] text-[1.22538rem] font-medium absolute top-1.5 left-20 uppercase">{item.label}</div>
                                            <div className="text-[#fa5677] text-[0.49506rem] italic font-normal absolute top-8 left-20">{item.sub}</div>
                                            <div className="inline-flex items-center gap-1 absolute bottom-2 left-20">
                                                <div className="text-[#5C1313] text-[0.75rem] font-semibold px-1 bg-[#EE2D2D] leading-[1.2rem]">{(item.price * item.count).toLocaleString()}$</div>
                                                <div className="text-[#5C1313] text-[0.75rem] font-semibold px-1 bg-[#EE2D2D] leading-[1.2rem]">{item.count}X</div>
                                            </div>
                                            <div className="flex w-4 flex-col items-start gap-[0.1875rem] absolute right-[0.86rem]">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none" className="w-4 h-4 btn-hover" onClick={() => handleRemoveFromCart(item.itemName)}>
                                                    <rect y="16.551" width="16.551" height="16.551" transform="rotate(-90 0 16.551)" fill="#fa5677" fill-opacity="0.05" />
                                                    <rect y="16.551" width="16.551" height="16.551" transform="rotate(-90 0 16.551)" fill="url(#paint0_radial_119_436)" fill-opacity="0.55" />
                                                    <rect x="0.482738" y="16.0683" width="15.5855" height="15.5855" transform="rotate(-90 0.482738 16.0683)" stroke="#fa5677" stroke-opacity="0.1" stroke-width="0.965476" />
                                                    <path d="M4.14062 12.4133L12.4135 4.13782" stroke="#fa5677" stroke-width="2.06888" />
                                                    <path d="M12.4111 12.4133L4.1383 4.13782" stroke="#fa5677" stroke-width="2.06888" />
                                                    <defs>
                                                        <radialGradient id="paint0_radial_119_436" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(8.32566 24.8265) rotate(-90) scale(28.8763 32.4393)">
                                                            <stop stop-color="#fa5677" />
                                                            <stop offset="0.392791" stop-color="#fa5677" stop-opacity="0" />
                                                        </radialGradient>
                                                    </defs>
                                                </svg>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none" className="w-4 h-4 btn-hover" onClick={() => handleIncreaseCount(item.itemName)}>
                                                    <rect y="16.551" width="16.551" height="16.551" transform="rotate(-90 0 16.551)" fill="#fa5677" fill-opacity="0.05" />
                                                    <rect y="16.551" width="16.551" height="16.551" transform="rotate(-90 0 16.551)" fill="url(#paint0_radial_119_440)" fill-opacity="0.55" />
                                                    <rect x="0.482738" y="16.0683" width="15.5855" height="15.5855" transform="rotate(-90 0.482738 16.0683)" stroke="#fa5677" stroke-opacity="0.1" stroke-width="0.965476" />
                                                    <path d="M8.27637 12.4133L8.27637 4.13782" stroke="#fa5677" stroke-width="2.06888" />
                                                    <path d="M12.4209 8.27441L4.14539 8.27509" stroke="#fa5677" stroke-width="2.06888" />
                                                    <defs>
                                                        <radialGradient id="paint0_radial_119_440" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(8.32566 24.8265) rotate(-90) scale(28.8763 32.4393)">
                                                            <stop stop-color="#fa5677" />
                                                            <stop offset="0.392791" stop-color="#fa5677" stop-opacity="0" />
                                                        </radialGradient>
                                                    </defs>
                                                </svg>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none" className="w-4 h-4 btn-hover" onClick={() => handleDecreaseCount(item.itemName)}>
                                                    <rect y="16.551" width="16.551" height="16.551" transform="rotate(-90 0 16.551)" fill="#fa5677" fill-opacity="0.05" />
                                                    <rect y="16.551" width="16.551" height="16.551" transform="rotate(-90 0 16.551)" fill="url(#paint0_radial_119_444)" fill-opacity="0.55" />
                                                    <rect x="0.482738" y="16.0683" width="15.5855" height="15.5855" transform="rotate(-90 0.482738 16.0683)" stroke="#fa5677" stroke-opacity="0.1" stroke-width="0.965476" />
                                                    <path d="M12.4131 8.27539L4.13758 8.27539" stroke="#fa5677" stroke-width="2.06888" />
                                                    <defs>
                                                        <radialGradient id="paint0_radial_119_444" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(8.32566 24.8265) rotate(-90) scale(28.8763 32.4393)">
                                                            <stop stop-color="#fa5677" />
                                                            <stop offset="0.392791" stop-color="#fa5677" stop-opacity="0" />
                                                        </radialGradient>
                                                    </defs>
                                                </svg>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        {/* Total Price */}
                        <div className="w-[23.79213rem] h-[1.8965rem] absolute right-12 bottom-[5.95rem] flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="381" height="31" viewBox="0 0 381 31" fill="none" className="w-full h-full">
                                <rect width="380.673" height="30.3435" fill="#5C1313" fill-opacity="0.45" />
                                <path d="M0 0H5.51701L0 5.51701V0Z" fill="#EE2D2D" />
                                <path d="M380.674 30.3435H372.398L380.674 23.4472V30.3435Z" fill="#EE2D2D" />
                                <path d="M0 30.3435L6.89626 30.3435L-4.82312e-07 24.8265L0 30.3435Z" fill="#EE2D2D" fill-opacity="0.2" />
                                <path d="M380.674 0L372.398 6.49385e-07L380.674 6.89626L380.674 0Z" fill="#EE2D2D" fill-opacity="0.2" />
                            </svg>
                            <div className="text-[#EE2D2D] text-base font-medium absolute leading-[100%] left-2">TỔNG TIỀN</div>
                            <div className="text-[#EE2D2D] text-base font-medium absolute leading-[100%] right-2">{displayedTotal.toLocaleString()}$</div>
                        </div>
                        {/* Buy btn */}
                        <div className="w-[11.465rem] h-[2.49988rem] absolute bottom-[2.93rem] left-[64.05rem] btn-hover" onClick={() => handleBuy('bank', cartData.cart)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none" className="w-[2.49988rem] h-[2.49988rem] absolute left-0">
                                <rect width="39.9983" height="39.9983" fill="#162347" fill-opacity="0.45" />
                                <rect x="6.66797" y="33.3318" width="26.6655" height="26.6655" transform="rotate(-90 6.66797 33.3318)" fill="#4D7AED" fill-opacity="0.05" />
                                <rect x="6.66797" y="33.3318" width="26.6655" height="26.6655" transform="rotate(-90 6.66797 33.3318)" fill="url(#paint0_radial_130_494)" fill-opacity="0.55" />
                                <rect x="7.00129" y="32.9985" width="25.9989" height="25.9989" transform="rotate(-90 7.00129 32.9985)" stroke="#4D7AED" stroke-opacity="0.1" stroke-width="0.666638" />
                                <mask id="mask0_130_494" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="7" y="7" width="26" height="26">
                                    <rect x="7.33301" y="7.33276" width="25.3323" height="25.3323" fill="#D9D9D9" />
                                </mask>
                                <g mask="url(#mask0_130_494)">
                                    <path d="M27.4697 21.4927C27.4697 23.6056 27.4699 24.6624 26.8135 25.3188C26.157 25.975 25.1001 25.9751 22.9873 25.9751H17.0107C14.8978 25.9751 13.841 25.9751 13.1846 25.3188C12.5281 24.6624 12.5283 23.6056 12.5283 21.4927V19.9985H27.4697V21.4927ZM16.2637 22.2397C15.8512 22.2398 15.5167 22.5743 15.5166 22.9868C15.5167 23.3993 15.8512 23.7338 16.2637 23.7339H16.2715C16.6839 23.7337 17.0185 23.3993 17.0186 22.9868C17.0185 22.5744 16.6839 22.2399 16.2715 22.2397H16.2637ZM22.9873 14.7681C25.1004 14.7681 26.157 14.7688 26.8135 15.4253C27.3875 15.9994 27.4597 16.8793 27.4688 18.5044H12.5293C12.5383 16.8794 12.6107 15.9994 13.1846 15.4253C13.841 14.7688 14.8977 14.7681 17.0107 14.7681H22.9873Z" fill="#4D7AED" />
                                </g>
                                <path d="M0 0H6.66638L0 6.66638V0Z" fill="#4D7AED" />
                                <path d="M39.9658 39.9673H31.9973L39.9658 31.9988V39.9673Z" fill="#4D7AED" />
                                <path d="M0 39.9983L7.99966 39.9983L-5.82794e-07 33.3319L0 39.9983Z" fill="#4D7AED" fill-opacity="0.2" />
                                <path d="M39.998 0L31.3318 7.57625e-07L39.998 9.33294L39.998 0Z" fill="#4D7AED" fill-opacity="0.2" />
                                <defs>
                                    <radialGradient id="paint0_radial_130_494" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(20.0815 46.6646) rotate(-90) scale(46.5228 52.2633)">
                                        <stop stop-color="#4D7AED" />
                                        <stop offset="0.392791" stop-color="#4D7AED" stop-opacity="0" />
                                    </radialGradient>
                                </defs>
                            </svg>
                            <div className="w-[8.70656rem] h-[2.49988rem] flex items-center justify-center absolute right-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="140" height="40" viewBox="0 0 140 40" fill="none" className="w-full h-full absolute">
                                    <rect width="139.304" height="39.9983" fill="#162347" fill-opacity="0.45" />
                                    <path d="M0.186523 0H6.67273L0.186523 6.48621V0Z" fill="#4D7AED" />
                                    <path d="M139.305 39.9983H131.029L139.305 33.102V39.9983Z" fill="#4D7AED" />
                                    <path d="M0.186523 39.9983L8.83481 39.9983L0.186523 33.5121L0.186523 39.9983Z" fill="#4D7AED" fill-opacity="0.2" />
                                    <path d="M139.305 0L131.029 6.61532e-07L139.305 8.27551L139.305 0Z" fill="#4D7AED" fill-opacity="0.2" />
                                </svg>
                                <div className="text-[#4D7AED] text-[1.24994rem] font-medium absolute">Ngân Hàng</div>
                            </div>
                        </div>
                        <div className="w-[11.465rem] h-[2.49988rem] absolute bottom-[2.93rem] right-12 btn-hover" onClick={() => handleBuy('cash', cartData.cart)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none" className="w-[2.49988rem] h-[2.49988rem] absolute left-0">
                                <rect width="39.9983" height="39.9983" fill="#5C1313" fill-opacity="0.45" />
                                <rect x="6.66699" y="33.3315" width="26.6655" height="26.6655" transform="rotate(-90 6.66699 33.3315)" fill="#C8D7EF" fill-opacity="0.05" />
                                <rect x="6.66699" y="33.3315" width="26.6655" height="26.6655" transform="rotate(-90 6.66699 33.3315)" fill="url(#paint0_radial_130_561)" fill-opacity="0.55" />
                                <rect x="7.00031" y="32.9982" width="25.9989" height="25.9989" transform="rotate(-90 7.00031 32.9982)" stroke="#EE2D2D" stroke-opacity="0.1" stroke-width="0.666638" />
                                <mask id="mask0_130_561" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="7" y="7" width="26" height="26">
                                    <rect x="7.33203" y="7.33276" width="25.3323" height="25.3323" fill="#D9D9D9" />
                                </mask>
                                <g mask="url(#mask0_130_561)">
                                    <path d="M24.4814 14.7681C25.8899 14.7681 26.5946 14.7689 27.0322 15.2065C27.4693 15.6442 27.4697 16.3484 27.4697 17.7563V22.2397C27.4697 23.6482 27.4698 24.3529 27.0322 24.7905C26.5946 25.2281 25.8899 25.228 24.4814 25.228H15.5156C14.1071 25.228 13.4025 25.2281 12.9648 24.7905C12.5272 24.3529 12.5273 23.6482 12.5273 22.2397V17.7563C12.5273 16.3483 12.5276 15.6442 12.9648 15.2065C13.4025 14.7689 14.1071 14.7681 15.5156 14.7681H24.4814ZM23.7344 22.2397C23.3218 22.2397 22.9873 22.5742 22.9873 22.9868C22.9873 23.3994 23.3218 23.7339 23.7344 23.7339H25.2285C25.6411 23.7338 25.9756 23.3994 25.9756 22.9868C25.9756 22.5743 25.6411 22.2398 25.2285 22.2397H23.7344ZM19.998 17.7573C18.7604 17.7575 17.7569 18.7609 17.7568 19.9985C17.757 21.2361 18.7605 22.2396 19.998 22.2397C21.2358 22.2397 22.2391 21.2362 22.2393 19.9985C22.2392 18.7607 21.2358 17.7573 19.998 17.7573ZM19.998 19.2515C20.4106 19.2515 20.7451 19.586 20.7451 19.9985C20.7449 20.411 20.4105 20.7456 19.998 20.7456C19.5857 20.7454 19.2512 20.4109 19.251 19.9985C19.251 19.5861 19.5856 19.2516 19.998 19.2515ZM14.7695 16.2622C14.3571 16.2622 14.0227 16.5969 14.0225 17.0093C14.0225 17.4219 14.3569 17.7563 14.7695 17.7563H16.2637C16.6761 17.7561 17.0107 17.4217 17.0107 17.0093C17.0105 16.597 16.6759 16.2624 16.2637 16.2622H14.7695Z" fill="#EE2D2D" />
                                </g>
                                <path d="M0 0H6.66638L0 6.66638V0Z" fill="#EE2D2D" />
                                <path d="M39.9678 39.9673H31.9993L39.9678 31.9988V39.9673Z" fill="#EE2D2D" />
                                <path d="M0 39.998L7.99966 39.998L-5.82794e-07 33.3317L0 39.998Z" fill="#EE2D2D" fill-opacity="0.2" />
                                <path d="M39.998 0L31.3318 7.57625e-07L39.998 9.33294L39.998 0Z" fill="#EE2D2D" fill-opacity="0.2" />
                                <defs>
                                    <radialGradient id="paint0_radial_130_561" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(20.0806 46.6643) rotate(-90) scale(46.5228 52.2633)">
                                        <stop stop-color="#EE2D2D" />
                                        <stop offset="0.392791" stop-color="#EE2D2D" stop-opacity="0" />
                                    </radialGradient>
                                </defs>
                            </svg>
                            <div className="w-[8.70656rem] h-[2.49988rem] flex items-center justify-center absolute right-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="140" height="41" viewBox="0 0 140 41" fill="none" className="w-full h-full absolute">
                                    <rect width="139.304" height="39.9983" fill="#5C1313" fill-opacity="0.45" />
                                    <path d="M0.185547 0.015625H6.67176L0.185547 6.50184V0.015625Z" fill="#EE2D2D" />
                                    <path d="M139.305 39.9983H129.65L139.305 31.7228V39.9983Z" fill="#EE2D2D" />
                                    <path d="M0.185547 40.0137L8.83383 40.0137L0.185546 33.5275L0.185547 40.0137Z" fill="#EE2D2D" fill-opacity="0.2" />
                                    <path d="M139.305 0L129.65 7.57616e-07L139.305 9.65476L139.305 0Z" fill="#EE2D2D" fill-opacity="0.2" />
                                </svg>
                                <div className="text-[#EE2D2D] text-[1.24994rem] font-medium absolute">Tiền Mặt</div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
});

export default Shop;