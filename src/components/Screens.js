import { firebase, firestore, auth } from '../components/configFirebase'
import { ref, onValue, get, update } from 'firebase/database'
import voatzStyles from '../styles/Voatz.module.css'
import styles from '../styles/Screens.module.css'
import Image from 'next/image'
import { useEffect, useState } from 'react'

function submit(event) {
    event.preventDefault()
    const voatzLogin = document.getElementById('voatzLogin')
    const voatzVote = document.getElementById('voatzVote')
    voatzLogin.style.display = 'none'
    voatzVote.style.display = 'flex'
    const url = document.getElementById('url')
    url.value = 'vote?loggedIn=true'
}

export function VoatzLogin() {
    return (
        <div className={voatzStyles.screen} id='voatzLogin'>
            <Image
                src='/icons/voatz.png'
                width={200}
                height={100}
                alt='voatz'
            />
            <form className={voatzStyles.signIn} onSubmit={(e) => submit(e)}>
                <p className={voatzStyles.header}>Username</p>
                <input type='text' placeholder='Username' className={voatzStyles.input}/>
                <p className={voatzStyles.header}>Password</p>
                <input type='text' placeholder='Password' className={voatzStyles.input}/>
                <input type='submit' placeholder='Enter' className={voatzStyles.input}/>
            </form>
        </div>
    )
}

function vote(name) {
    const voatzVote = document.getElementById('voatzVote')
    const voatzDone = document.getElementById('voatzDone')
    const url = document.getElementById('url')
    const uid = 'applesauce'
    get(ref(firebase, 'opponents')).then((snapshot) => {
        var data = snapshot.val()
        const updates = {}
        if (data.OPP1.name == name) {
            updates['/opponents/OPP1/votes'] = data.OPP1.votes + 1
            update(ref(firebase), updates)
        } else if (data.OPP2.name == name) {
            updates['/opponents/OPP2/votes'] = data.OPP2.votes + 1
            update(ref(firebase), updates)
        }
    })
    get(ref(firebase, 'players')).then((snapshot) => {
        var data = snapshot.val()
        var count = 1
        data.forEach((player) => {
            const updates = {}
            if (player.UID == uid) {
                updates['/players/' + count + '/POINTS'] = player.POINTS + 10
                update(ref(firebase), updates)
            }
            count++
        })
    })
    voatzVote.style.display = 'none'
    voatzDone.style.display = 'flex'
    url.value = 'vote?'+ name.toLowerCase() + '=true'
}

function Opponent({name, points}) {
    return (
        <div className={voatzStyles.opponent}>
            <p className={voatzStyles.name}>{name}</p>
            <div className={voatzStyles.block} onClick={() => vote(name)}>
                <p className={voatzStyles.points}>{points}</p>
                <p className={voatzStyles.text}>Vote me!</p>
            </div>
        </div>
    )
}

export function VoatzVote({ opponents }) {
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
        <div className={voatzStyles.screen} style={{display: 'none'}} id='voatzVote'>
            <div style={{display: 'inline-flex', justifyContent: 'space-between', width: '52%'}}>
                <Opponent name={opponents[0].name} points={printPoints1}/>
                <Opponent name={opponents[1].name} points={printPoints2}/>
            </div>
        </div>
    )
}

export function VoatzDone() {
    return (
        <div className={voatzStyles.screen} style={{display: 'none', fontWeight: '600'}} id='voatzDone'>
            <p>Congrats, you successfully voted!</p>
            <p>Thank you for your vote.</p>
        </div>
    )
}

function Leader({ number, name, points, id }) {
    var place = number + 'th'
    if (number == 1) {
        place = number + 'st'
    } else if (number == 2) {
        place = number + 'nd'
    } else if (number == 3) {
        place = number + 'rd'
    }
    return (
        <div className={styles.info} style={{display: 'flex', justifyContent: 'space-between'}} key={id}>
            <div style={{display: 'inline-flex'}}>
                <p style={{width: '60px', marginRight: '30px'}}>{place}</p>
                <p>{name}</p>
            </div>
            <p>{points}pts</p>
        </div>
    )
}

export function Leaderboard() {
    const [leaders, setLeaders] = useState([])
    useEffect(() => {
        async function updateLeaders() {
            onValue(ref(firebase, 'players'), (snapshot) => {
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
                setLeaders(players.slice(0, 7))
            })
        }
        updateLeaders()
    }, [])
    var number = 0
    return (
        <div className={styles.screen} style={{display: 'none'}} id='leaderboard'>
            <p className={styles.header}>Leaderboard</p>
            <div className={styles.background}>
                {leaders.map((leader) => {
                    number++
                    return (
                        <Leader number={number} name={leader.UID} points={leader.POINTS} key={'leader' + number}/>
                    )
                })}
            </div>
        </div>
    )
}

export function NotFound() {
    return (
        <div className={styles.screen} style={{display: 'none'}} id='notFound'>
            <p className={styles.header}>404 Not Found</p>
        </div>
    )
}