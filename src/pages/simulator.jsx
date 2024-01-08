import styles from '../styles/Simulator.module.css'
import Image from 'next/Image'
import { firebase } from '../components/configFirebase'
import { ref, onValue, get, update } from 'firebase/database'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Leaderboard, NotFound, VoatzDone, VoatzLogin, VoatzVote } from '../components/Screens'

function P({ color='#464646', children }) {
    return (
        <p style={{
            fontSize: '15px',
            fontWeight: 500,
            color: color }}>
            {children}
        </p>
    )
}

function Back() {
    const router = useRouter()
    return (
        <button className={styles.back}
            onClick={() => router.push('/election')}>
            <Image
                src='/icons/backIcon.png'
                width={30}
                height={30}
                style={{ marginRight: '10px' }}
                alt='Back'
            />
            <P color='white'>Election</P>
        </button>
    )
}

function Player({ user }) {
    const router = useRouter()
    const [place, setPlace] = useState('')
    const [points, setPoints] = useState(user.POINTS)
    useEffect(() => {
        async function updatePoints() {
            onValue(ref(firebase, 'players'), (snapshot) => {
                var countPlace = 1
                var players = snapshot.val()
                players.sort(function (a, b) {
                    if (a.POINTS < b.POINTS) {
                        return 1
                    }
                    if (a.POINTS > b.POINTS) {
                        return -1
                    }
                    return 0;
                })
                players.forEach((player) => {
                    if (player.UID == user.UID) {
                        setPoints(player.POINTS)
                        if (countPlace == 1) {
                            setPlace('1st')
                        } else if (countPlace == 2) {
                            setPlace('2nd')
                        } else if (countPlace == 3) {
                            setPlace('3rd')
                        } else {
                            setPlace(countPlace + 'th')
                        }
                    }
                    countPlace++
                })
            })
        }
        updatePoints()
    }, [points])
    return (
        <button className={styles.navButton}
            onClick={() => router.push('/')}> 
            <P color='white'>{user.USERNAME}</P>
            <div className={styles.info}>
                <P>{place}</P>
                <P>{points}pts</P>
            </div>
        </button>
    )
}

function Tools() {
    function openTool(event) {
        const button = event.currentTarget
        button.className = styles.toolSelected
        button.firstElementChild.style.color = '#464646'
        const leaderboard = document.getElementById('leaderboard')
        if (button.innerText == 'Website') {
            const emailButton = button.nextElementSibling
            emailButton.className = styles.tool
            emailButton.firstElementChild.style.color = '#FFFFFF'
            leaderboard.style.display = 'none'
        } else if (button.innerText == 'Leaderboard') {
            const websiteButton = button.previousElementSibling
            websiteButton.className = styles.tool
            websiteButton.firstElementChild.style.color = '#FFFFFF'
            leaderboard.style.display = 'flex'
            leaderboard.style.zIndex = 10
        }
    }
    return (
        <div>
            <P color='white'>Tools</P>
            <button className={styles.toolSelected}
                onClick={(e) => openTool(e)}>
                <P>Website</P>
            </button>
            <button className={styles.tool}
                onClick={(e) => openTool(e)}>
                <P color='white'>Leaderboard</P>
            </button>
        </div>
    )
}

function Votes({ opponents }) {
    const router = useRouter()
    const [points1, setPoints1] = useState(0)
    const [points2, setPoints2] = useState(0)
    const [printPoints1, setPrintPoints1] = useState('')
    const [printPoints2, setPrintPoints2] = useState('')
    useEffect(() => {
        async function updatePoints() {
            onValue(ref(firebase, 'opponents/OPP1'), (snapshot) => {
                setPoints1(snapshot.val().votes)
            })
            onValue(ref(firebase, 'opponents/OPP2'), (snapshot) => {
                setPoints2(snapshot.val().votes)
            })
            setPrintPoints1(points1)
            setPrintPoints2(points2)
            if (points1 > points2) {
                setPrintPoints1(String.fromCharCode(0x2605) + points1 + String.fromCharCode(0x2605))
            } else if (points2 > points1) {
                setPrintPoints2(String.fromCharCode(0x2605) + points2 + String.fromCharCode(0x2605))
            }
        }
        updatePoints()
    }, [points1, points2])
    return (
        <div>
            <button className={styles.navButton}
                onClick={() => router.push('/election')}>
                <P color='white'>Votes</P>
                <div className={styles.info}>
                    <P color='white'>{opponents[0]}</P>
                    <P color='white'>{printPoints1}</P>
                </div>
                <div className={styles.info}>
                    <P color='white'>{opponents[1]}</P>
                    <P color='white'>{printPoints2}</P>
                </div>
            </button>
        </div>
    )
}

function Navigation({user}) {
    return (
        <div className={styles.navigation}>
            <Back/>
            <Player user={user} />
            <Tools/>
            <Votes opponents={['Cats', 'Dogs']} />
        </div>
    )
}

function changeScreen() {
    const url = document.getElementById('url').value
    const voatzLogin = document.getElementById('voatzLogin')
    const voatzVote = document.getElementById('voatzVote')
    const voatzDone = document.getElementById('voatzDone')
    const notFound = document.getElementById('notFound')
    if (url.includes('/')) {
        notFound.style.display = 'flex'
        voatzLogin.style.display = 'none'
        voatzVote.style.display = 'none'
        voatzDone.style.display = 'none'
    } else {
        notFound.style.display = 'none'
        if (url.includes('vote') || url == '?loggedIn=true') {
            voatzLogin.style.display = 'none'
            voatzDone.style.display = 'none'
            voatzVote.style.display = 'flex'
        } else if (url.includes('login')) {
            voatzLogin.style.display = 'flex'
            voatzVote.style.display = 'none'
            voatzDone.style.display = 'none'
        }
    }
}

function Address() {
    return (
        <div className={styles.address} style={{ display: 'inline-flex' }}>
            <Image
                src='/icons/lockIcon.png'
                width={12}
                height={12}
                className={styles.lock}
                alt='Lock'
            />
            <p id='fixedUrl' className={styles.fixedUrl}>https://voatz.app/</p>
            <input type='url'
                id='url'
                className={styles.url}
                placeholder='login'
                onChange={() => changeScreen()}
            />
        </div>
    )
}

function Menu() {
    return (
        <div className={styles.menu}>
            <button className={styles.menuButton} style={{ backgroundColor: '#D5DEE6' }}></button>
            <button className={styles.menuButton}></button>
            <Address/>
        </div>
    )
}

function Screen({ opponents }) {
    return (
        <div>
            <Leaderboard/>
            <VoatzLogin/>
            <VoatzVote opponents={opponents}/>
            <VoatzDone/>
            <NotFound/>
        </div>
    )
}

function Simulator() {
    const [user, setUser] = useState({})
    const [opponents, setOpponents] = useState([])
    const uid = 'applesauce'
    useEffect(() => {
        async function getData() {
            get(ref(firebase, 'players')).then((snapshot) => {
                var data = snapshot.val()
                data.forEach((player) => {
                    if (player.UID == uid) {
                        setUser({
                            UID: player.UID,
                            POINTS: player.POINTS,
                            TEAM: player.TEAM
                        })
                    }
                })
            })
            get(ref(firebase, 'opponents')).then((snapshot) => {
                var data = snapshot.val()
                setOpponents([{
                    name: data.OPP1.name,
                    points: data.OPP1.points
                },{
                    name: data.OPP2.name,
                    points: data.OPP2.points
                }])
            })
        }
        getData()
    }, [])
    if (opponents[0] != null) {
        var team = user.TEAM == 'OPP1' ? opponents[0].name : opponents[1].name
        return (
            <div styles={{ display: 'inline-flex'} }>
                <Navigation user={user} />
                <div style={{display: 'flex'}}>
                    <div className={styles.team}>
                        <p>You are playing for Team {team}.</p>
                    </div>
                    <div className={styles.window}>
                        <Menu/>
                        <Screen opponents={opponents}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Simulator