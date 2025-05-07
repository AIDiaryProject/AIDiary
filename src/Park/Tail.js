import React from "react";

const Tail = () => {
    return(
        <div className="tail">
            <div style={{display:'flex', flexDirection:'row', alignItems:'flex-end'}}>
                <div className="tail__sub-title">GITHUB : </div>
                <button className="tail__button" onClick={() => {window.open("https://github.com/AIDiaryProject/AIDiary", "_blank");}}>마음숲</button>
            </div>
            <p className="tail__text2">© 2025. Park HyeongJun, Lee JinHyeok All rights reserved.</p>
        </div>
    );
};

export default Tail;