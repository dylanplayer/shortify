import Head from "next/head";

import styles from "./index.module.css";
import { signOut } from "next-auth/react";
import { InferGetServerSidePropsType, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "@/server/getServerSession";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Link } from ".prisma/client";
import { useEffect, useState } from "react";

const LinksQuery = gql`
  query LinksQuery($first: Int, $after: ID) {
    links(first: $first, after: $after) {
      edges {
        node {
        id
        url
        slug
        user {
          id
          email
        }
      }
      }
    }
  }
`;

const CreateLinkMutation = gql`
  mutation CreateLinkMutation($url: String!) {
    createLink(url: $url) {
      id
      url
      slug
      user {
        id
        email
      }
    }
  }
`;

export async function getServerSideProps({req, res}: {req: NextApiRequest, res: NextApiResponse}) {
  const session = await getServerSession({ req, res });

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
      props: {},
    }
  }

  return {
    props: {},
  };
}

export default function Dashboard(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, loading, error } = useQuery(LinksQuery);
  const [links, setLinks] = useState<Partial<Link>[]>([]);
  const [newLinkUrl, setNewLinkUrl] = useState<string>('');
  const [createLink, {loading: createLinkLoading, error: createLinkError}] = useMutation(CreateLinkMutation);

  const handleCreateLink = async () => {
    const {data} = await createLink({variables: {url: newLinkUrl}});
    if (data?.createLink) {
      setLinks([...links, data.createLink]);
      setNewLinkUrl('');
    }
  };

  useEffect(() => {
    if (data?.links.edges) {
      setLinks(data.links.edges.map(({node: link}: {node: Link}) => link));
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Head>
        <title>Dashboard | Shortify</title>
      </Head>
      <nav className={styles.navbar}>
        <h1 className={styles.navbarBrand}>Shortify</h1>
        <button className={styles.button} onClick={() => signOut()}>Sign Out</button>
      </nav>
      <main className={styles.main}>
        <section className={styles.section}>
          <h1 className={styles.title}>Your Links</h1>
          <p className={styles.subtitle}>Manage your links here</p>
          <div className={styles.links}>
            <div className={styles.linksHeader}>
              <h2 className={styles.linkSlugHeader}>Short URL</h2>
              <h2 className={styles.linkUrlHeader}>URL</h2>
            </div>
            {links.map((link) => (
              <div className={styles.link} key={link.id}>
                <a className={styles.linkSlug} href={`/s/${link.slug}`}>{`${window.location.origin}/s/${link.slug}`}</a>
                <a className={styles.linkUrl} href={link.url}>{link.url}</a>
              </div>
            ))}
            {
              createLinkError && (
                <div className={styles.error}>
                  <p>{createLinkError.message}</p>
                </div>
              )
            }
            {
              createLinkLoading && (
                <div className={styles.loading}>
                  <p>Loading...</p>
                </div>
              )
            }
            {!createLinkLoading && !createLinkError && (
              <div className={styles.newLink}>
                <input className={styles.newLinkInput} type="url" placeholder="Enter a url" value={newLinkUrl} onChange={(e) => setNewLinkUrl(e.target.value)}/>
                <button className={styles.newLinkButton} onClick={() => handleCreateLink()}>Shortify Link</button>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
