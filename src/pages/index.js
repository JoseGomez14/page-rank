import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { SearchIcon, SettingsIcon } from "@/components/iconos";
import SettingsModal from "@/components/settingsModal";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [pageRank, setPageRank] = useState({});
  const [error, setError] = useState(null);
  const [recomendations, setRecomendations] = useState([]);
  const [inputSearch, setInputSearch] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    fetch("/api/pageRank")
      .then((res) => res.json())
      .then((data) => setRecomendations(data.pageRank.slice(0, 5)));

    if (!localStorage.getItem("topicsPreferences")) {
      setShowSettings(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = e.target.query.value.trim();
    if (query) {
      fetch(`/api/pageRank?query=${query}`)
        .then((res) => res.json())
        .then((data) => {
          setPageRank(data);
          if (data.pageRank.length === 0) {
            setError("No results found, try another query...");
          } else {
            setError(null);
          }
        });
    }
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setInputSearch(value);
    if (!value) {
      setPageRank({});
    }
  };

  return (
    <>
      <Head>
        <title>JoGui</title>
        <meta name="description" content="JoGui.Net is a search engine PageRank based" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <button
          className={styles.settingButton}
          onClick={() => setShowSettings(true)}
        >
          <SettingsIcon />
        </button>
        <div className={styles.center}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
        </div>
        <form className={styles.search} onSubmit={handleSubmit}>
          <input
            id="query"
            name="query"
            value={inputSearch}
            onChange={handleInputChange}
            className={styles.input}
            type="text"
            placeholder="Search..."
            autoComplete="off"
          />
          <button className={styles.button} type="submit" title="Search">
            <SearchIcon />
          </button>
        </form>
        <br />
        <div className={styles.grid}>
          {pageRank.pageRank ? (
            <>
              {error && <p className={inter.className}>{error}</p>}

              {pageRank.pageRank.length > 0 && (
                <h2 className={inter.className}>
                  {pageRank.pageRank.length} Result
                  {pageRank.pageRank.length === 1 ? "" : "s"}, in{" "}
                  {pageRank.time.toFixed(4)} seconds, with {pageRank.iterations}{" "}
                  iterations
                </h2>
              )}
              {pageRank.pageRank.map(({ value, title, description }, index) => (
                <div key={index} className={styles.card}>
                  <h2 className={inter.className}>{title}</h2>
                  <p className={inter.className}>{description}</p>
                  <p className={inter.className}>PR: {value.toFixed(4)}</p>
                </div>
              ))}
            </>
          ) : (
            recomendations.length > 0 && (
              <>
                <h2 className={inter.className}>Recomended Pages</h2>
                {recomendations.map(({ value, title, description }, index) => (
                  <div key={index} className={styles.card}>
                    <h2 className={inter.className}>{title}</h2>
                    <p className={inter.className}>{description}</p>
                    <p className={inter.className}>PR: {value.toFixed(4)}</p>
                  </div>
                ))}
              </>
            )
          )}
        </div>
        <SettingsModal show={showSettings} setShow={setShowSettings} />
      </main>
    </>
  );
}
