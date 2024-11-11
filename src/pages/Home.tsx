import { useEffect, useRef, useState } from "react"
import TedImg from '../assets/ted.png'
import TedWalkImg from '../assets/ted-walk.png'
import BeerImg from '../assets/beer.png'
import TobacoImg from '../assets/tobaco.png'
import { calculateAngleBetweenPlatforms } from "../utils/utils"

export const Home = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [growingInterval, setGrowingInterval] = useState<number>(0)
    const [heroImage, setHeroImage] = useState<CanvasImageSource | null>(null)
    const [heroWalkImage, setHeroWalkImage] = useState<CanvasImageSource | null>(null)
    const [beerImage, setBeerImage] = useState<CanvasImageSource | null>(null)
    const [tobacoImage, setTobacoImage] = useState<CanvasImageSource | null>(null)

    const [isLoading, setIsLoading] = useState(true)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isDead, setIsDead] = useState(false)
    const [isInit, setIsInit] = useState<boolean>(false)
    const [gameState, setGameState] = useState<string>("ready")
    const [score, setScore] = useState<number>(0)


    const [cameraOffset, setCameraOffset] = useState(0);
    const [cameraMove, setCameraMove] = useState(0);

    const [walls, setWalls] = useState([{ x: 0, y: 0, width: 0, height: 0 }, { x: 0, y: 0, width: 0, height: 0 }])
    const [wallStep, setWallStep] = useState(0)
    const [wallX, setWallX] = useState(0)
    const [wallGrow, setWallGrow] = useState(0)
    const [currentWall, setCurrentWall] = useState(0)

    const [heroPosition, setHeroPosition] = useState({ x: 0, y: 0, distance: 0 });
    const [heroSize, setHeroSize] = useState({ width: 0, height: 0 })

    const [stickColor, setStickColor] = useState("#00ff00")
    const [stickGrow, setStickGrow] = useState(0)
    const [stickAngleGrow, setStickAngleGrow] = useState(0)
    const [stickWidth, setStickWidth] = useState(0)
    const [stickLength, setStickLength] = useState(0)
    const [stickAngle, setStickAngle] = useState(0)
    const [stickPosition, setStickPosition] = useState({ x: 0, y: 0 })

    const [fixY] = useState(15)
    const [fixX] = useState(15)


    useEffect(() => {
        if (isLoading) setTimeout(() => setIsLoading(false), 2000)
    }, [isLoading])

    useEffect(() => {
        if (!isLoading) {
            document.addEventListener("contextmenu", (event) => {
                event.preventDefault();
            });

            const windowWidth = window.innerWidth
            const isMobile = windowWidth <= 768
            const game = document.getElementById('game')
            const heroImage = document.getElementById('ted') as CanvasImageSource
            const heroWalkImage = document.getElementById('ted-walk') as CanvasImageSource
            const beerImage = document.getElementById('beer') as CanvasImageSource
            const tobacoImage = document.getElementById('tobaco') as CanvasImageSource


            if (game && !isDead) {
                const cameraMoveTemp = isMobile ? 6 : 3

                const stickGrowTemp = isMobile ? 10 : 20
                const stickWidthTemp = isMobile ? 5 : 15
                const stickAngleGrowTemp = isMobile ? 5 : 5

                const wallHeightTemp = isMobile ? 200 : 500
                const wallGrow = isMobile ? 100 : 300
                const wallWidthTemp = isMobile ? 100 : 200
                const wallXtemp = isMobile ? 50 : 200
                const wallStepTemp = isMobile ? 150 : 400
                const wallYtemp = game.offsetHeight - wallHeightTemp


                const heroSizeTemp = isMobile ? { width: 60, height: 66 } : { width: 150, height: 165 }
                const heroPositionXTemp = wallXtemp + wallWidthTemp / 2 - heroSizeTemp.width / 2
                const heroPositionYTemp = game.offsetHeight - wallHeightTemp - heroSizeTemp.height

                setScore(0)
                setCameraMove(cameraMoveTemp)

                setWallX(wallXtemp)
                setWalls([{ x: wallXtemp, y: wallYtemp, width: wallWidthTemp, height: wallHeightTemp }, { x: wallXtemp + wallStepTemp, y: wallYtemp, width: wallWidthTemp, height: wallHeightTemp }])
                setWallGrow(wallGrow)
                setWallStep(wallStepTemp)
                setCurrentWall(0)

                setStickColor("#00ff00")
                setStickGrow(stickGrowTemp)
                setStickAngleGrow(stickAngleGrowTemp)
                setStickWidth(stickWidthTemp)
                setStickPosition({ x: wallXtemp + wallWidthTemp, y: wallYtemp })
                setStickLength(0);
                setStickAngle(0);

                setHeroPosition({ x: heroPositionXTemp, y: heroPositionYTemp, distance: 0 })
                setHeroSize(heroSizeTemp)

                setHeroImage(heroImage)
                setHeroWalkImage(heroWalkImage)
                setBeerImage(beerImage)
                setTobacoImage(tobacoImage)

                setGameState('ready');
                setCameraOffset(0);
                setIsInit(true)
            }
        }
    }, [isLoading, isPlaying])

    useEffect(() => {
        if (isInit && isPlaying) {
            const canvas = canvasRef.current;
            const game = document.getElementById('game')
            if (canvas && game) {
                canvas.width = game.offsetWidth
                canvas.height = game.offsetHeight
                const ctx = canvas.getContext('2d');

                if (ctx && heroImage && beerImage && heroWalkImage && tobacoImage) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // draw score
                    ctx.shadowColor = "rgba(0, 0, 0, 1)";
                    ctx.shadowBlur = 10;
                    ctx.shadowOffsetX = 4;
                    ctx.shadowOffsetY = 4;
                    ctx.font = "60px Arial";
                    ctx.fillStyle = "#00ff00";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";

                    ctx.fillText(`Score: ${score.toString()}`, canvas.width / 2, 150);
                    // draw score


                    //draw walls

                    walls.forEach(wall => {
                        ctx.drawImage(beerImage, wall.x - cameraOffset, wall.y, wall.width, wall.height)
                    })


                    //draw walls

                    //draw character

                    ctx.drawImage(gameState === "walking" ? heroWalkImage : heroImage, heroPosition.x - cameraOffset, heroPosition.y, heroSize.width, heroSize.height)

                    //draw character

                    //draw stick

                    if (gameState === 'ready' || gameState == "droping" || gameState === 'walking' || gameState === "dying") {
                        ctx.save()
                        ctx.translate(stickPosition.x - cameraOffset - fixX, stickPosition.y + fixY);
                        ctx.rotate((stickAngle * Math.PI) / 180);
                        ctx.fillStyle = stickColor;
                        ctx.fillRect(0,
                            -stickLength,
                            stickWidth,
                            stickLength);
                        ctx.restore()
                    }

                    //draw stick
                }

            }



        }

    }, [isInit, stickLength, gameState, stickAngle, heroPosition, cameraOffset, isPlaying])


    useEffect(() => {
        if (gameState === "ready" && isPlaying) growCandle()
    }, [gameState, isPlaying])


    const growCandle = () => {
        let growingInterval = setInterval(() => {
            setStickLength((prev) => prev + stickGrow)
        }, 100)
        setGrowingInterval(growingInterval)
    }

    const handleMouseDown = () => {
        if (isInit && isPlaying) {
            if (gameState === "ready") {
                clearInterval(growingInterval)
                setGameState("playing")
                const targetWall = walls[walls.length - 1]
                const betweenStickAngle = calculateAngleBetweenPlatforms(stickPosition.x, stickPosition.y, targetWall.x, targetWall.y, stickPosition.y - targetWall.y)
                const targetStickAngle = targetWall.height < walls[currentWall].height ? 90 - betweenStickAngle : 90 - betweenStickAngle - stickAngleGrow
                const betweenStickAngleRadians = -betweenStickAngle * Math.PI / 180
                let currentStickAngle = 0
                const dropStick = () => {
                    setGameState("droping")
                    if (currentStickAngle <= targetStickAngle) {
                        currentStickAngle += stickAngleGrow;
                        setStickAngle(currentStickAngle);
                        requestAnimationFrame(dropStick);
                    } else {
                        let currentHeroPositionX = heroPosition.x
                        let currentHeroPositionY = heroPosition.y
                        let currentDistance = heroPosition.distance
                        const heroWalking = () => {
                            setGameState("walking")
                            const conditionStick = stickLength
                            if (currentHeroPositionX <= stickPosition.x + conditionStick) {
                                currentDistance += 0.2
                                if (betweenStickAngle <= 0) {
                                    if (currentHeroPositionY < targetWall.y - heroSize.height) {
                                        currentHeroPositionX += currentDistance * Math.cos(betweenStickAngleRadians)
                                        currentHeroPositionY += currentDistance * Math.sin(betweenStickAngleRadians)
                                    }
                                    else {
                                        currentHeroPositionX += currentDistance
                                        currentHeroPositionY = targetWall.y - heroSize.height
                                    }
                                }
                                else {
                                    if (currentHeroPositionY > targetWall.y - heroSize.height) {
                                        currentHeroPositionX += currentDistance * Math.cos(betweenStickAngleRadians)
                                        currentHeroPositionY += currentDistance * Math.sin(betweenStickAngleRadians)
                                    }
                                    else {
                                        currentHeroPositionX += currentDistance
                                        currentHeroPositionY = targetWall.y - heroSize.height
                                    }
                                }
                                setHeroPosition({ x: currentHeroPositionX, y: currentHeroPositionY, distance: currentDistance })
                                requestAnimationFrame(heroWalking);
                            } else {
                                if (currentHeroPositionX >= targetWall.x && currentHeroPositionX + heroSize.width / 6 <= targetWall.x + targetWall.width) {
                                    let cameraOffsetTemp = cameraOffset;
                                    const moveCamera = setInterval(() => {
                                        if (cameraOffsetTemp < targetWall.x - wallX) {
                                            cameraOffsetTemp += cameraMove
                                            setCameraOffset(cameraOffsetTemp);
                                        }
                                        else {
                                            clearInterval(moveCamera)
                                            let randomWallHeight = (Math.floor(Math.random() * 2) - 1) * wallGrow
                                            setScore(prev => prev + 1)
                                            setWalls([...walls, { x: targetWall.x + wallStep + Math.random() * wallStep, y: walls[0].y - randomWallHeight, width: walls[0].width, height: walls[0].height + randomWallHeight }])
                                            setStickLength(0);
                                            setStickAngle(0);
                                            if (stickGrow < stickGrow + 10) setStickGrow(stickGrow + 1)
                                            setCurrentWall(currentWall + 1)
                                            setHeroPosition({ x: currentHeroPositionX, y: currentHeroPositionY, distance: 0 })
                                            setStickPosition({ x: targetWall.x + targetWall.width, y: targetWall.y })
                                            setGameState("ready")
                                        }
                                    }, 1)
                                } else {
                                    setStickAngle(180);
                                    setStickColor("red")
                                    setGameState("dying")
                                    const heroFalling = () => {
                                        if (currentHeroPositionY <= walls[0].y + walls[0].height - heroSize.height) {
                                            currentHeroPositionY += 5
                                            setHeroPosition({ x: currentHeroPositionX, y: currentHeroPositionY, distance: currentDistance })
                                            requestAnimationFrame(heroFalling)
                                        }
                                        else {
                                            setIsDead(true)
                                            setIsPlaying(false)
                                        }
                                    }
                                    requestAnimationFrame(heroFalling);
                                }
                            }
                        }
                        requestAnimationFrame(heroWalking);
                    }
                }
                requestAnimationFrame(dropStick);
            }
        }
    }



    return <div
        onTouchStart={handleMouseDown}
        onMouseDown={handleMouseDown}
        id="game"
        className="h-screen w-full"
    >
        {isLoading && <div id="loading">Loading...</div>}
        {!isLoading && !isPlaying && !isDead && <div id="play">
            <h1>TED BEAR ETH</h1>
            <h3>How to play?<br /> Click on the screen to make the stick stop grow and fall!</h3>
            <button onClick={() => setIsPlaying(true)}>Play game</button>
        </div>}
        {!isLoading && isDead && <div id="dead">
            <h2>BRO! YOU DEAD!</h2>
            <button onClick={() => {
                setIsDead(false)
                setIsPlaying(true)
            }}>Play again</button>
        </div>}
        <canvas ref={canvasRef} />
        <img id="tobaco" src={TobacoImg} className="hidden" />
        <img id="ted" src={TedImg} className="hidden" />
        <img id="ted-walk" src={TedWalkImg} className="hidden" />
        <img id="beer" src={BeerImg} className="hidden" />
    </div>
}