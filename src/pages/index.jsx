import Layout from '../components/Layout'
import styles from '@/styles/Home.module.css'
import { firebase } from '../components/configFirebase'
import { ref, get, set } from 'firebase/database'
import { useRouter } from 'next/router'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

function onlyNumbersAndLetters(string) {
    return /^[A-Za-z0-9]*$/.test(string)
}

async function play(router) {
    const displayName = document.getElementById('name').value
    const error = document.getElementById('error')
    var repeatedName = false
    var number = Math.floor((Math.random() * 2) + 1)
    var count = 1
    await get(ref(firebase, 'players')).then((snapshot) => {
        var players = snapshot.val()
        players.forEach((player) => {
            if (player.UID == displayName) {
                error.innerText = 'Display name already in use'
                error.style.display = 'flex'
                repeatedName = true
            }
            count++
        })
    })
    if (displayName == '') {
        error.innerText = 'Missing display name'
        error.style.display = 'flex'
    } else if (!onlyNumbersAndLetters(displayName)) {
        error.innerText = 'Use only numbers and letters'
        error.style.display = 'flex'
    } else if (!repeatedName) {
        await set(ref(firebase, 'players/' + count), {
            UID: displayName,
            TEAM: 'OPP' + number,
            POINTS: 0
        })
        localStorage.setItem('player', displayName)
        router.push('/election')
    }
}

function Home() {
    const router = useRouter()
    return (
        <Layout title='Home' color='#D5DEE6'>
            <div className={styles.center}>
                <p className={styles.header}>Rig the Vote</p>
                <p className={styles.description}>Cheat the voting simulation to earn as many votes as possible for your team.</p>
                <p className={styles.description}>The team with the highest votes wins that round.</p>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <p className={styles.text}>Create a display name</p>
                    <input type='text' placeholder='Display name' className={styles.input} id='name'/>
                    <p className={styles.error} id='error'>Missing name</p>
                    <input type='submit' placeholder='Play!' className={styles.input} onClick={() => play(router)} id='submit'/>
                </div>
            </div>
        </Layout>
    )
}

export default Home