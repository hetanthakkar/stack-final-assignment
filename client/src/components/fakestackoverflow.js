import React from "react";
import { useState } from "react";
import Header from "./header";
import Main from "./main";

export default function FakeStackOverflow() {
  const [search, setSearch] = useState("");
  const [profile, setProfile] = useState(false);
  const [mainTitle, setMainTitle] = useState("All Questions");

  const setQuesitonPage = (search = "", title = "All Questions") => {
    setSearch(search);
    setMainTitle(title);
    setProfile(false);
  };
  return (
    <>
      <Header
        search={search}
        setQuesitonPage={setQuesitonPage}
        setProfile={setProfile}
      />
      <Main
        title={mainTitle}
        search={search}
        profile={profile}
        setProfile={setProfile}
        setQuesitonPage={setQuesitonPage}
      />
    </>
  );
}
