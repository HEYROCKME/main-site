import { useAuth0 } from "@auth0/auth0-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import DonationsChart from "../../components/profile/donations/donationsChart";
import DonationsTotals from "../../components/profile/donations/donationsTotal";
import DonationYearMenu from "../../components/profile/donations/yearMenu";
import { DonationList } from "../../components/lists/donationList/donationList";
import { Layout } from "../../components/profile/layout";
import { useApi } from "../../hooks/useApi";
import {
  AggregatedDonations,
  Distribution,
  Donation,
  Donor,
} from "../../models";
import { LayoutPage } from "../../types";
import style from "../../styles/Donations.module.css";
import DonationsDistributionTable from '../../components/profile/donations/donationsDistributionTable'
import { Spinner } from '../../components/elements/spinner'
import { DonationsYearlyGraph } from '../../components/profile/donations/donationsYearlyChart'

const Home: LayoutPage = () => {
  const { getAccessTokenSilently, user } = useAuth0();
  const router = useRouter();

  const {
    loading: donorLoading,
    error: donorError,
    data: donor,
  } = useApi<Donor>(
    `/donors/${user ? user["https://konduit.no/user-id"] : ""}/`,
    "GET",
    "read:donations",
    getAccessTokenSilently
  );

  const {
    loading: aggregatedLoading,
    data: aggregatedDonations,
    error: aggregatedError,
  } = useApi<AggregatedDonations[]>(
    `/donors/${
      user ? user["https://konduit.no/user-id"] : ""
    }/donations/aggregated`,
    "GET",
    "read:donations",
    getAccessTokenSilently
  );

  const {
    loading: donationsLoading,
    data: donations,
    error: donationsError,
  } = useApi<Donation[]>(
    `/donors/${user ? user["https://konduit.no/user-id"] : ""}/donations/`,
    "GET",
    "read:donations",
    getAccessTokenSilently
  );

  const kids = new Set<string>();
  donations?.map((donation) => kids.add(donation.KID));

  const {
    loading: distributionsLoading,
    data: distributions,
    error: distributionsError,
  } = useApi<Distribution[]>(
    `/donors/${
      user ? user["https://konduit.no/user-id"] : ""
    }/distributions/?kids=${encodeURIComponent(Array.from(kids).join(","))}`,
    "GET",
    "read:donations",
    getAccessTokenSilently,
    !donationsLoading
  );

  if (
    aggregatedLoading ||
    !aggregatedDonations ||
    donationsLoading ||
    !donations ||
    distributionsLoading ||
    !distributions ||
    donorLoading ||
    !donor
  )
    return <Spinner />;

  const isTotal = typeof router.query.year === "undefined"

  const registeredYear = new Date(donor?.registered).getFullYear();
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let i = registeredYear; i <= currentYear; i++) {
    years.push(i);
  }
  const firstYear = Math.min(...years);
  const sum = aggregatedDonations.reduce(
    (acc, curr) =>
      router.query.year === curr.year.toString() || !router.query.year
        ? acc + parseFloat(curr.value)
        : acc,
    0
  );
  const distributionsMap = new Map<string, Distribution>();
  distributions.map((dist) => distributionsMap.set(dist.kid, dist));

  const periodText =
    !isTotal
      ? `I ${router.query.year} har du gitt`
      : `Siden ${firstYear} har du gitt`;

  let distribution =
    !isTotal
      ? getYearlyDistribution(
          aggregatedDonations,
          parseInt(router.query.year as string)
        )
      : getTotalDistribution(aggregatedDonations);

  const donationList = !isTotal ?
    <DonationList 
      donations={donations.filter(donation => new Date(donation.timestamp).getFullYear() === parseInt(router.query.year as string))}
      distributions={distributionsMap}
      year={router.query.year as string} /> :
    years.sort((a,b) => b-a).map(year => 
      (<DonationList 
        key={year}
        donations={donations.filter(donation => new Date(donation.timestamp).getFullYear() === year)}
        distributions={distributionsMap}
        year={year.toString()} />)
    )

  return (
    <>
      <Head>
        <title>Konduit. - Profil</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={style.header}>Donasjoner</h1>

      <DonationYearMenu
        years={years}
        selected={(router.query.year as string) || "total"}
      />

      <DonationsChart distribution={distribution}></DonationsChart>

      <div className={style.details}>
        <DonationsDistributionTable
          distribution={distribution}
        ></DonationsDistributionTable>
        <DonationsTotals
          sum={sum}
          period={periodText}
          comparison={"Det er 234% så mye som en gjennomsnittlig giver"}
        />
      </div>
      {
        isTotal && window.innerWidth < 900 ?
        <DonationsYearlyGraph data={getYearlySum(aggregatedDonations, years)} /> :
        donationList
      }
      {/* <Donations /> */}
    </>
  );
};

Home.layout = Layout;
export default Home;

const getTotalDistribution = (
  aggregated: AggregatedDonations[]
): { org: string; sum: number }[] => {
  const distribution = [];

  const summed = aggregated.reduce((acc: { [key: string]: number }, curr) => {
    if (curr.organization in acc) {
      acc[curr.organization] += parseFloat(curr.value);
    } else {
      acc[curr.organization] = parseFloat(curr.value);
    }
    return acc;
  }, {});

  for (const key in summed) {
    distribution.push({ org: key, sum: summed[key] });
  }

  return distribution;
};

const getYearlyDistribution = (
  aggregated: AggregatedDonations[],
  year: number
): { org: string; sum: number }[] => {
  return aggregated
    .filter(el => el.year === year)
    .map(el => ({ org: el.organization, sum: parseFloat(el.value) }))
}

const getYearlySum = (aggregated: AggregatedDonations[], years: number[]): { year: string, sum: number }[] => {
  return years.map((year) => ({
    year: year.toString(),
    sum: aggregated.reduce((acc,curr) => curr.year == year ? acc + parseFloat(curr.value) : acc, 0)
  }))
}
