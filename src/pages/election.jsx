import Layout from '../components/Layout'
import styles from '@/styles/Election.module.css'
import Image from 'next/Image'
import { firebase } from '../components/configFirebase'
import { ref, onValue } from 'firebase/database'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
 
function Opponent({ name, points }) {
    return (
        <div>
            <Image
                src={'/icons/' + name.substring(0, name.length - 1) + '.png'}
                width={175}
                height={175}
                alt={name}
                style={{marginBottom: '-15px', marginLeft: '15px'}}
            />
            <div className={styles.pedestal}>
                <p className={styles.name}>{name}</p>
                <p className={styles.points}>{points}</p>
            </div>
        </div>
    )
}

function vote(router) {
    router.push('/simulator')
}

function Election() {
    const router = useRouter()
    const opponents = ['cats', 'dogs']
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
        <Layout title='Election'>
            <div className={styles.center}>
                <p className={styles.header}>Place your votes...</p>
                <p className={styles.description}>First to 30 votes wins!</p>
                <div style={{display: 'inline-flex', justifyContent: 'space-between', width: '70%'}}>    
                    <Opponent name={opponents[0]} points={printPoints1}/>
                    <p className={styles.vs}>vs</p>
                    <Opponent name={opponents[1]} points={printPoints2}/>
                </div>
                <button className={styles.vote} onClick={() => vote(router)}>Vote</button>
            </div>
        </Layout>
    )
}

export default Election