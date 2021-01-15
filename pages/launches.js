import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'
import Link from 'next/link'
import Date from '../components/date'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: 'https://api.spacex.land/graphql/',
    cache: new InMemoryCache()
  });

  const allPostsData = getSortedPostsData()
  const { data } = await client.query({
    query: gql`
      query GetLaunches {
        launchesPast(limit: 10) {
          id
          mission_name
          launch_date_local
          launch_site {
            site_name_long
          }
          links {
            article_link
            video_link
            mission_patch
          }
          rocket {
            rocket_name
          }
        }
      }
    `
  });
  return {
    props: {
      launches: data.launchesPast
    }
  }
}

export default function Home({ launches }) {
  console.log(launches)
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>🚀‍👨🏻‍🚀</p>
      </section>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Launches</h2>
        <ul className={utilStyles.list}>
          {launches.map(({ id, mission_name, launch_date_local }) => (
            <li className={utilStyles.listItem} key={id}>
              <a>{mission_name}</a>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={launch_date_local} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}
