import type { NextPage } from 'next'
import Head from 'next/head'
import AuthOrRedirect from '../../components/AuthOrRedirect'
import DriveContent from '../../components/DriveContent'
import Header from '../../components/Header'
import SearchWrapper from '../../components/SearchWrapper'
import SideMenu from '../../components/SideMenu'
import { PathProvider } from '../../contexts/Path'

const Home: NextPage = () => {
    return (
        <div>
            <Head>
                <title>Cloud</title>
            </Head>

            <main className="flex flex-col h-screen w-full">
                <AuthOrRedirect path="/login">
                    <PathProvider>
                        <SearchWrapper>
                            {(results, fetching, search) => (
                                <>
                                <Header search={search}/>
                                <div className="flex min-h-0 grow">
                                    <SideMenu/>
                                    <DriveContent
                                        searchResults={results}
                                        searchFetching={fetching}
                                    />
                                </div>
                                </>
                            )}
                        </SearchWrapper>
                    </PathProvider>
                </AuthOrRedirect>
            </main>
        </div>
    )
}

export default Home