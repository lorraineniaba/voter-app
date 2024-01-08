import styles from '../styles/NavBar.module.css'
import { useRouter } from 'next/navigation'

function NavButton({ text, location }) {
    const router = useRouter()
    return (
        <button
            className={styles.navButton}
            onClick={() => router.push((location))}>
            {text}
        </button>
    )
}

function NavBar() {
    return (
        <div className={styles.navBar}>
            <div>
                <NavButton text='Voter App' location='/' />
            </div>
            <div>
                <NavButton text='Vote' location='/simulator' />
            </div>
        </div>
    )

}
export default NavBar