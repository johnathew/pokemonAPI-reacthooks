import { useState } from "react";
import { FaArrowCircleDown } from "react-icons/fa";

const ScrollBottomButton = () => {

    const [visible, setVisible] = useState(false)

    const toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 300) {
            setVisible(true)
        }
        else if (scrolled <= 300) {
            setVisible(false)
        }
    };

    const scrollToBottom = () => {
        window.scroll({
            top: document.documentElement.scrollHeight,
            left: 0,
            behavior: 'smooth'
        });
    };

    window.addEventListener('scroll', toggleVisible);

    return (
        <button type='button' className='hover:bg-slate-900 hover:underline text-yellow-400 flex flex-col items-center  fixed focus:outline-none  font-medium rounded-lg text-xl p-2 text-center dark:bg-slate-900 dark:hover:bg-blue-700  md:left-[10%] md:top-[23%] top-[20%] left-2 '>
            <FaArrowCircleDown onClick={scrollToBottom}
                style={{ display: visible ? 'inline' : 'none' }} />
        </button>
    );
}

export default ScrollBottomButton; 