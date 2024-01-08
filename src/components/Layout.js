import Head from 'next/head'
import NavBar from '../components/NavBar'
import styles from '../styles/Layout.module.css'

function Layout({ title, children, color='#FFFFFF' }) {
    return (
        <div style={{height: '100vh', backgroundColor: color}}>
            <Head>
                <title>{title ? title + " | " : ""} Voter App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <NavBar/>
            <div className={styles.main}>
                {children}
            </div>
        </div>
    )
}

export default Layout