import type { NextPage } from 'next'
import Head from 'next/head'
import DriveTable from '../components/DriveTable'

const Home: NextPage = () => {
    return (
        <div className="flex min-h-screen flex-col items-center">
            <Head>
                <title>Cloud</title>
            </Head>

            <main className="min-h-screen min-w-screen w-full">
                <DriveTable/>
            </main>
            <footer>
                <ul>
                    <li>info</li>
                    <li>info</li>
                    <li>info</li>
                    <li>info</li>
                    <li>info</li>
                </ul>
            </footer>
        </div>
    )
}

export default Home
