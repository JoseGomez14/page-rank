import styles from "@/styles/Home.module.css";
import Graph from "@/components/Graph";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

function webg() {
  return (
    <main className={styles.main} style={{ padding: "3rem 1rem" }}>
      <h1 className={inter.className} style={{ marginBottom: "2rem" }}>
        <Link href="/">&larr; </Link>
        The Web Graph
      </h1>
      <Graph />
    </main>
  );
}

export default webg;
