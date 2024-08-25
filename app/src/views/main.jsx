import React, { useEffect, useState, useRef } from "react"
import './style.css'
import axios from 'axios';

function Games({ dai, rong }) {
    const [poke, setPoke] = useState([])
    const [loading, setLoading] = useState(true)

    const getPokemonImage = async (name) => {
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
            .then((res) => {
                return res
            })

        return res.data.sprites.front_default
    }

    function xu_li_anh(arr) {
        const array = arr.concat(arr)

        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    useEffect(() => {
        (async () => {
            dai = parseInt(dai, 10)
            rong = parseInt(rong, 10)
            console.log(dai * rong);

            let urls = []
            for (let i = 1; i <= dai * rong; i++) {
                console.log(i);
                const url = await getPokemonImage(i);
                if (url) urls.push(url);
            }

            urls = xu_li_anh(urls)
            // console.log(urls);

            if (urls.length > 0) setPoke(urls)
            else console.log("faile to fetch");
            setLoading(false)
        })();
    }, [])


    const [move, setMove] = useState([-1, -1]);
    const [step, setStep] = useState(0)
    const [travel, setTravel] = useState([])

    const handleCLick = (e) => {
        let [a, b] = [move[0], move[1]]
        console.log(a);

        if(a === -1) {
            e.currentTarget.style.transform = "rotateY(180deg)";
            a = e.currentTarget.id
            console.log("ID của phần tử:", a);
            
            setMove([a, move[1]])
        }
        
        else if(b === -1) {
            e.currentTarget.style.transform = "rotateY(180deg)";
            b = e.currentTarget.id
            console.log("ID của phần tử:", a);
            
            setMove([move[0], b])
        }
    }

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    useEffect(() => {
        console.log("Step:", step);
        if(step == poke.length && step != 0) {alert("Anh Bạn Đúng Là Thiên Tài, ok để chơi lại"); window.location.reload(true);}
            
    }, [step])

    useEffect(() => {
        console.log("Khởi tạo mảng travel!");
        const newTravel = Array(poke.length).fill(0);
        setTravel(newTravel);
    }, [poke])

    useEffect(() => {
        (async () => {
        const a = poke[move[0]];
        const b = poke[move[1]];
        console.log(move);
        
        if(move[0] == move[1] && (move[0] != -1 || move[1] != -1)) {
            setMove([-1,-1])
            console.log("Click 1 chỗ ăn cc à cu");
            const ele1 = document.getElementById(move[0])
            ele1.style.transform = "none";
        }
        else if(move[0] != -1 && move[1] != -1) {
            if(a===b) {
                await sleep(500);
                console.log("Hai thẻ giống nhau!");
                const arr = [...travel];
                arr[move[0]] =  1
                arr[move[1]] =  1;
                console.log((arr));
                setTravel(arr)
                setStep(step+2);
            }
            else if(a!=b) {
                await sleep(1000);
                console.log("Hai thẻ khác nhau!");
                const ele1 = document.getElementById(move[0])
                ele1.style.transform = "none";
                const ele2 = document.getElementById(move[1])
                ele2.style.transform = "none";
            }
            setMove([-1,-1])
        }
    }
    )();
        
    }, [move]); 

    return (
        <>
            {loading &&
                <div
                    className="skeleton"
                ></div>
            }
            {!loading &&
                <div className="pokemon-gallery">
                    {poke.map((image, index) => (
                        <>
                            <div className="container">
                                <div className="card" onClick={handleCLick} id={index}>
                                    <div className="front" id={index+100}></div>
                                    <div className="back">
                                        <img key={index} src={image} alt={`Pokémon ${index + 1}`} />
                                    </div>
                                </div>
                            </div>
                        </>
                    ))}
                </div >
            }
        </>
    )
}

function Main(params) {
    const [playing, setPlay] = useState(false)

    const dai = useRef(null)
    const rong = useRef(null)


    const [daiValue, setDaiValue] = useState('');
    const [rongValue, setRongValue] = useState('');

    const handleDai = (e) => {
        const val = e.target.value
        const numVal = parseInt(val, 10)
        if (e.type === 'keydown' && e.key === 'Enter') {
            console.log('Nhấn Enter, giá trị hiện tại:', daiValue);
        }

        if ((numVal >= 1 && numVal <= 9 || val === '')) {
            setDaiValue(val);
        }
    };

    const handleRong = (e) => {
        const val = e.target.value
        const numVal = parseInt(val, 10)
        if (e.type === 'keydown' && e.key === 'Enter') {
            console.log('Nhấn Enter, giá trị hiện tại:', daiValue);
        }
        if ((numVal >= 1 && numVal <= 9 || val === '')) {
            setRongValue(val);
        }
    };

    const KeyDown = (e) => {
        if (e.key === 'Enter') { // Kiểm tra nếu phím nhấn là Enter
            const dai = daiValue;
            const rong = rongValue;
            if (!rong || !dai) {
                alert('sai kích thước!')
                console.log(1);
                return;
            }
            if (rong === 0 || dai === 0) {
                alert('sai kích thước!')
                console.log(2);

                return;
            }
            console.log(dai, rong);
            setPlay(true)
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', KeyDown);

        return () => {
            document.removeEventListener('keydown', KeyDown);
        };
    }, [daiValue, rongValue])

    return (
        <>
            <div className="icr_box">
                <div className="text">Nhập kích thước</div>
                <div className="input_box">
                    <input type="text" disabled={playing} ref={dai} onChange={handleDai}
                        value={daiValue}
                    />
                    <div className="x">X</div>
                    <input type="text" disabled={playing} ref={rong} onChange={handleRong}
                        value={rongValue}
                    />
                </div>
            </div>

            {playing &&
                <Games dai={daiValue} rong={rongValue} />
            }
        </>
    )
}

export default Main