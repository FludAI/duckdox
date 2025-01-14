// BirthdayParadoxGame.jsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Calculator, History, ChevronRight, ChevronLeft } from "lucide-react";
import _ from 'lodash';
import { cn } from "../lib/utils";
import Confetti from 'react-confetti';

// Pull custom Card component from the ui folder
const Card = ({ children, className }) => (
  <div className={cn("rounded-lg border bg-white shadow-sm", className)}>
    {children}
  </div>
);

const CardHeader = ({ children, className }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)}>
    {children}
  </div>
);

const CardTitle = ({ children, className }) => (
  <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)}>
    {children}
  </h3>
);

const CardContent = ({ children, className }) => (
  <div className={cn("p-6 pt-0", className)}>
    {children}
  </div>
);
// Bring in all president images from the assets folder so it's easier for teachers to edit (no db or serving file)
import abrahamlincoln from '../assets/presidents/abraham-lincoln.jpg';
import andrewjackson from '../assets/presidents/andrew_jackson.jpg';
import andrewjohnson from '../assets/presidents/andrew-johnson.jpg';
import barackobama from '../assets/presidents/barack-obama.jpg';
import benjaminharrison from '../assets/presidents/benjamin-harrison.jpg';
import billclinton from '../assets/presidents/bill-clinton.jpg';
import calvincoolidge from '../assets/presidents/calvin_coolidge.jpg';
import chesteraarthur from '../assets/presidents/chester-a-arthur.jpg';
import donaldtrump from '../assets/presidents/donald-trump.jpg';
import dwightdeisenhower from '../assets/presidents/dwight-d-eisenhower.jpg';
import franklindroosevelt from '../assets/presidents/franklin-d-roosevelt.jpg';
import franklinpierce from '../assets/presidents/franklin-pierce.jpg';
import georgehwbush from '../assets/presidents/george-h-w-bush.jpg';
import georgewashington from '../assets/presidents/george-washington.jpg';
import georgewbush from '../assets/presidents/george-w-bush.jpg';
import geraldford from '../assets/presidents/gerald-ford.jpg';
import grovercleveland from '../assets/presidents/grover-cleveland.jpg';
import harrystruman from '../assets/presidents/harry-s-truman.jpg';
import herberthoover from '../assets/presidents/herbert-hoover.jpg';
import jamesagarfield from '../assets/presidents/james-a-garfield.jpg';
import jamesbuchanan from '../assets/presidents/james-buchanan.jpg';
import jameskpolk from '../assets/presidents/james-k-polk.jpg';
import jamesmadison from '../assets/presidents/james-madison.jpg';
import jamesmonroe from '../assets/presidents/james-monroe.jpg';
import jimmycarter from '../assets/presidents/jimmy-carter.jpg';
import joebiden from '../assets/presidents/joe-biden.jpg';
import johnadams from '../assets/presidents/john-adams.jpg';
import johnfkennedy from '../assets/presidents/john-f-kennedy.jpg';
import johnquincyadams from '../assets/presidents/john-quincy-adams.jpg';
import johntyler from '../assets/presidents/john-tyler.jpg';
import lyndonbjohnson from '../assets/presidents/lyndon-b-johnson.jpg';
import millardfillmore from '../assets/presidents/millard-fillmore.jpg';
import richardnixon from '../assets/presidents/richard-nixon.jpg';
import ronaldreagan from '../assets/presidents/ronald-reagan.jpg';
import rutherfordbhayes from '../assets/presidents/rutherford-b-hayes.jpg';
import theodoreroosevelt from '../assets/presidents/theodore-roosevelt.jpg';
import thomasjefferson from '../assets/presidents/thomas-jefferson.jpg';
import ulyssessgrant from '../assets/presidents/ulysses-s-grant.jpg';
import warrengharding from '../assets/presidents/warren-g-harding.jpg';
import williamhenryharrison from '../assets/presidents/william-henry-harrison.jpg';
import williamhowardtaft from '../assets/presidents/william-howard-taft.jpg';
import williammckinley from '../assets/presidents/william-mckinley.jpg';
import woodrowwilson from '../assets/presidents/woodrow_wilson.jpg';
import zacharytaylor from '../assets/presidents/zachary-taylor.jpg';





// Map all images for easy access later
const presidentImages = {
  "abraham-lincoln": abrahamlincoln,
  "andrew_jackson": andrewjackson,
  "andrew-johnson": andrewjohnson,
  "barack-obama": barackobama,
  "benjamin-harrison": benjaminharrison,
  "bill-clinton": billclinton,
  "calvin_coolidge": calvincoolidge,
  "chester-a-arthur": chesteraarthur,
  "donald-trump": donaldtrump,
  "dwight-d-eisenhower": dwightdeisenhower,
  "franklin-d-roosevelt": franklindroosevelt,
  "franklin-pierce": franklinpierce,
  "george-h-w-bush": georgehwbush,
  "george-washington": georgewashington,
  "george-w-bush": georgewbush,
  "gerald-ford": geraldford,
  "grover-cleveland": grovercleveland,
  "harry-s-truman": harrystruman,
  "herbert-hoover": herberthoover,
  "james-a-garfield": jamesagarfield,
  "james-buchanan": jamesbuchanan,
  "james-k-polk": jameskpolk,
  "james-madison": jamesmadison,
  "james-monroe": jamesmonroe,
  "jimmy-carter": jimmycarter,
  "joe-biden": joebiden,
  "john-adams": johnadams,
  "john-f-kennedy": johnfkennedy,
  "john-quincy-adams": johnquincyadams,
  "john-tyler": johntyler,
  "lyndon-b-johnson": lyndonbjohnson,
  "millard-fillmore": millardfillmore,
  "richard-nixon": richardnixon,
  "ronald-reagan": ronaldreagan,
  "rutherford-b-hayes": rutherfordbhayes,
  "theodore-roosevelt": theodoreroosevelt,
  "thomas-jefferson": thomasjefferson,
  "ulysses-s-grant": ulyssessgrant,
  "warren-g-harding": warrengharding,
  "william-henry-harrison": williamhenryharrison,
  "william-howard-taft": williamhowardtaft,
  "william-mckinley": williammckinley,
  "woodrow_wilson": woodrowwilson,
  "zachary-taylor": zacharytaylor
};
const BirthdayParadoxGame = () => {
    const [presidentData, setPresidentData] = useState([]);
    const [theoreticalData, setTheoreticalData] = useState([]);
  const [simulatedData, setSimulatedData] = useState([]);
   
  const [hasMovedSlider, setHasMovedSlider] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const [actualMatches, setActualMatches] = useState([]);
    const [selectedSize, setSelectedSize] = useState(23);
    const [selectedPresident, setSelectedPresident] = useState(null);
    const [showBirthdayMatches, setShowBirthdayMatches] = useState(false);
    const [initialized, setInitialized] = useState(false);
  
// One-time setup to generate necessary data - don't delete this or you will get an infinite loop
    useEffect(() => {
        if (!initialized) {
          setTheoreticalData(generateTheoreticalData());
          setSimulatedData(generateSimulationData());
          setInitialized(true);
        }
      }, [initialized]);

    // Get theoretical probabilities using a simple formula
    const calculateTheoreticalProbability = (n) => {
        let probability = 1;
        for (let i = 0; i < n; i++) {
          probability *= (365 - i) / 365;
        }
        return (1 - probability) * 100;
      };
      
  // Prepare theoretical data (from 2 to 50 people)
  const generateTheoreticalData = () => {
    const data = [];
    for (let i = 2; i <= 50; i++) {
      data.push({
        groupSize: i,
        probability: calculateTheoreticalProbability(i)
      });
    }
    return data;
  };
  
  // Simulate probabilities using the Monte Carlo method
  const generateSimulationData = (trials = 10000) => {
    const data = [];
    for (let i = 2; i <= 50; i++) {
      let matches = 0;
      for (let t = 0; t < trials; t++) {
        const birthdays = Array.from({ length: i }, () => Math.floor(Math.random() * 365));
        const uniqueDays = new Set(birthdays);
        if (uniqueDays.size < birthdays.length) matches++;
      }
      data.push({
        groupSize: i,
        probability: (matches / trials) * 100
      });
    }
    return data;
  };
    
// Quick utility to match president birthdays - adapts for future president
const PRESIDENTS_DATA = [
  {
      "id": 1,
      "name": "George Washington",
      "dateOfBirth": "1732-02-22",
      "party": "None",
      "birthplace": "Pope's Creek, Virginia",
      "stateAbbreviation": "VA",
      "imageId": "george-washington",
      "orderOfOffice": [{ "number": 1, "startYear": 1789, "endYear": 1797 }],
      "funFact": "George Washington never lived in the White House."
  },
  {
      "id": 2,
      "name": "John Adams",
      "dateOfBirth": "1735-10-30",
      "party": "Federalist",
      "birthplace": "Braintree, Massachusetts",
      "stateAbbreviation": "MA",
      "imageId": "john-adams",
      "orderOfOffice": [{ "number": 2, "startYear": 1797, "endYear": 1801 }],
      "funFact": "John Adams was the first president to live in the White House."
  },
  {
      "id": 3,
      "name": "Thomas Jefferson",
      "dateOfBirth": "1743-04-13",
      "party": "Democratic-Republican",
      "birthplace": "Goochland County, Virginia",
      "stateAbbreviation": "VA",
      "imageId": "thomas-jefferson",
      "orderOfOffice": [{ "number": 3, "startYear": 1801, "endYear": 1809 }],
      "funFact": "Thomas Jefferson was the principal author of the Declaration of Independence."
  },
  {
      "id": 4,
      "name": "James Madison",
      "dateOfBirth": "1751-03-16",
      "party": "Democratic-Republican",
      "birthplace": "Port Conway, Virginia",
      "stateAbbreviation": "VA",
      "imageId": "james-madison",
      "orderOfOffice": [{ "number": 4, "startYear": 1809, "endYear": 1817 }],
      "funFact": "James Madison is known as the 'Father of the Constitution.'"
  },
  {
    "id": 5,
    "name": "James Monroe",
    "dateOfBirth": "1758-04-28",
    "party": "Democratic-Republican",
    "birthplace": "Westmoreland County, Virginia",
    "stateAbbreviation": "VA",
    "imageId": "james-monroe",
    "orderOfOffice": [{ "number": 5, "startYear": 1817, "endYear": 1825 }],
    "funFact": "James Monroe's presidency is known as the 'Era of Good Feelings.'"
},
{
    "id": 6,
    "name": "John Quincy Adams",
    "dateOfBirth": "1767-07-11",
    "party": "Democratic-Republican",
    "birthplace": "Braintree, Massachusetts",
    "stateAbbreviation": "MA",
    "imageId": "john-quincy-adams",
    "orderOfOffice": [{ "number": 6, "startYear": 1825, "endYear": 1829 }],
    "funFact": "John Quincy Adams was the first president to be photographed."
},
{
    "id": 7,
    "name": "Andrew Jackson",
    "dateOfBirth": "1767-03-15",
    "party": "Democratic",
    "birthplace": "Waxhaw Settlement, South Carolina",
    "stateAbbreviation": "SC",
    "imageId": "andrew_jackson",
    "orderOfOffice": [{ "number": 7, "startYear": 1829, "endYear": 1837 }],
    "funFact": "Andrew Jackson was the first president to ride a train."
},
{
    "id": 8,
    "name": "Martin Van Buren",
    "dateOfBirth": "1782-12-05",
    "party": "Democratic",
    "birthplace": "Kinderhook, New York",
    "stateAbbreviation": "NY",
    "imageId": "martin-van-buren",
    "orderOfOffice": [{ "number": 8, "startYear": 1837, "endYear": 1841 }],
    "funFact": "Martin Van Buren was the first president born as a U.S. citizen."
},
{
    "id": 9,
    "name": "William Henry Harrison",
    "dateOfBirth": "1773-02-09",
    "party": "Whig",
    "birthplace": "Charles City County, Virginia",
    "stateAbbreviation": "VA",
    "imageId": "william-henry-harrison",
    "orderOfOffice": [{ "number": 9, "startYear": 1841, "endYear": 1841 }],
    "funFact": "William Henry Harrison served the shortest presidency, lasting only 31 days."
},
{
    "id": 10,
    "name": "John Tyler",
    "dateOfBirth": "1790-03-29",
    "party": "Whig",
    "birthplace": "Charles City County, Virginia",
    "stateAbbreviation": "VA",
    "imageId": "john-tyler",
    "orderOfOffice": [{ "number": 10, "startYear": 1841, "endYear": 1845 }],
    "funFact": "John Tyler had the most children of any president, fathering 15."
},
{
    "id": 11,
    "name": "James K. Polk",
    "dateOfBirth": "1795-11-02",
    "party": "Democratic",
    "birthplace": "Pineville, North Carolina",
    "stateAbbreviation": "NC",
    "imageId": "james-k-polk",
    "orderOfOffice": [{ "number": 11, "startYear": 1845, "endYear": 1849 }],
    "funFact": "James K. Polk is known for significantly expanding U.S. territory."
},
{
  "id": 12,
  "name": "Zachary Taylor",
  "dateOfBirth": "1784-11-24",
  "party": "Whig",
  "birthplace": "Barboursville, Virginia",
  "stateAbbreviation": "VA",
  "imageId": "zachary-taylor",
  "orderOfOffice": [{ "number": 12, "startYear": 1849, "endYear": 1850 }],
  "funFact": "Zachary Taylor was a national hero for his role in the Mexican-American War."
},
{
  "id": 13,
  "name": "Millard Fillmore",
  "dateOfBirth": "1800-01-07",
  "party": "Whig",
  "birthplace": "Summerhill, New York",
  "stateAbbreviation": "NY",
  "imageId": "millard-fillmore",
  "orderOfOffice": [{ "number": 13, "startYear": 1850, "endYear": 1853 }],
  "funFact": "Millard Fillmore established the first permanent library in the White House."
},
{
  "id": 14,
  "name": "Franklin Pierce",
  "dateOfBirth": "1804-11-23",
  "party": "Democratic",
  "birthplace": "Hillsborough, New Hampshire",
  "stateAbbreviation": "NH",
  "imageId": "franklin-pierce",
  "orderOfOffice": [{ "number": 14, "startYear": 1853, "endYear": 1857 }],
  "funFact": "Franklin Pierce was the first president to affirm, not swear, the oath of office."
},
{
  "id": 15,
  "name": "James Buchanan",
  "dateOfBirth": "1791-04-23",
  "party": "Democratic",
  "birthplace": "Cove Gap, Pennsylvania",
  "stateAbbreviation": "PA",
  "imageId": "james-buchanan",
  "orderOfOffice": [{ "number": 15, "startYear": 1857, "endYear": 1861 }],
  "funFact": "James Buchanan is the only bachelor president."
},
{
  "id": 16,
  "name": "Abraham Lincoln",
  "dateOfBirth": "1809-02-12",
  "party": "Republican",
  "birthplace": "Hardin County, Kentucky",
  "stateAbbreviation": "KY",
  "imageId": "abraham-lincoln",
  "orderOfOffice": [{ "number": 16, "startYear": 1861, "endYear": 1865 }],
  "funFact": "Abraham Lincoln was a licensed bartender and wrestling champion."
},
{
  "id": 17,
  "name": "Andrew Johnson",
  "dateOfBirth": "1808-12-29",
  "party": "Democratic",
  "birthplace": "Raleigh, North Carolina",
  "stateAbbreviation": "NC",
  "imageId": "andrew-johnson",
  "orderOfOffice": [{ "number": 17, "startYear": 1865, "endYear": 1869 }],
  "funFact": "Andrew Johnson was the first president to be impeached."
},
{
  "id": 18,
  "name": "Ulysses S. Grant",
  "dateOfBirth": "1822-04-27",
  "party": "Republican",
  "birthplace": "Point Pleasant, Ohio",
  "stateAbbreviation": "OH",
  "imageId": "ulysses-s-grant",
  "orderOfOffice": [{ "number": 18, "startYear": 1869, "endYear": 1877 }],
  "funFact": "Ulysses S. Grant was a Civil War hero and a skilled horseman."
},
{
  "id": 19,
  "name": "Rutherford B. Hayes",
  "dateOfBirth": "1822-10-04",
  "party": "Republican",
  "birthplace": "Delaware, Ohio",
  "stateAbbreviation": "OH",
  "imageId": "rutherford-b-hayes",
  "orderOfOffice": [{ "number": 19, "startYear": 1877, "endYear": 1881 }],
  "funFact": "Rutherford B. Hayes ended Reconstruction in the South."
},
{
  "id": 20,
  "name": "James A. Garfield",
  "dateOfBirth": "1831-11-19",
  "party": "Republican",
  "birthplace": "Moreland Hills, Ohio",
  "stateAbbreviation": "OH",
  "imageId": "james-a-garfield",
  "orderOfOffice": [{ "number": 20, "startYear": 1881, "endYear": 1881 }],
  "funFact": "James A. Garfield was assassinated after only 200 days in office."
},
{
  "id": 21,
  "name": "Chester A. Arthur",
  "dateOfBirth": "1829-10-05",
  "party": "Republican",
  "birthplace": "Fairfield, Vermont",
  "stateAbbreviation": "VT",
  "imageId": "chester-a-arthur",
  "orderOfOffice": [{ "number": 21, "startYear": 1881, "endYear": 1885 }],
  "funFact": "Chester A. Arthur modernized the U.S. Navy."
},
{
  "id": 22,
  "name": "Grover Cleveland",
  "dateOfBirth": "1837-03-18",
  "party": "Democratic",
  "birthplace": "Caldwell, New Jersey",
  "stateAbbreviation": "NJ",
  "imageId": "grover-cleveland",
  "orderOfOffice": [{ "number": 22, "startYear": 1885, "endYear": 1889 }, { "number": 24, "startYear": 1893, "endYear": 1897 }],
  "funFact": "Grover Cleveland is the only president to serve two non-consecutive terms."
},
{
  "id": 23,
  "name": "Benjamin Harrison",
  "dateOfBirth": "1833-08-20",
  "party": "Republican",
  "birthplace": "North Bend, Ohio",
  "stateAbbreviation": "OH",
  "imageId": "benjamin-harrison",
  "orderOfOffice": [{ "number": 23, "startYear": 1889, "endYear": 1893 }],
  "funFact": "Benjamin Harrison was the first president to use electricity in the White House."
},
{
  "id": 25,
  "name": "William McKinley",
  "dateOfBirth": "1843-01-29",
  "party": "Republican",
  "birthplace": "Niles, Ohio",
  "stateAbbreviation": "OH",
  "imageId": "william-mckinley",
  "orderOfOffice": [{ "number": 25, "startYear": 1897, "endYear": 1901 }],
  "funFact": "William McKinley was the first president to campaign by telephone."
},
{
  "id": 26,
  "name": "Theodore Roosevelt",
  "dateOfBirth": "1858-10-27",
  "party": "Republican",
  "birthplace": "New York City, New York",
  "stateAbbreviation": "NY",
  "imageId": "theodore-roosevelt",
  "orderOfOffice": [{ "number": 26, "startYear": 1901, "endYear": 1909 }],
  "funFact": "Theodore Roosevelt was the first American to win a Nobel Peace Prize."
},
{
  "id": 19,
  "name": "Rutherford B. Hayes",
  "dateOfBirth": "1822-10-04",
  "party": "Republican",
  "birthplace": "Delaware, Ohio",
  "stateAbbreviation": "OH",
  "imageId": "rutherford-b-hayes",
  "orderOfOffice": [{ "number": 19, "startYear": 1877, "endYear": 1881 }],
  "funFact": "Rutherford B. Hayes ended Reconstruction in the South."
},
{
  "id": 20,
  "name": "James A. Garfield",
  "dateOfBirth": "1831-11-19",
  "party": "Republican",
  "birthplace": "Moreland Hills, Ohio",
  "stateAbbreviation": "OH",
  "imageId": "james-a-garfield",
  "orderOfOffice": [{ "number": 20, "startYear": 1881, "endYear": 1881 }],
  "funFact": "James A. Garfield was assassinated after only 200 days in office."
},
{
  "id": 21,
  "name": "Chester A. Arthur",
  "dateOfBirth": "1829-10-05",
  "party": "Republican",
  "birthplace": "Fairfield, Vermont",
  "stateAbbreviation": "VT",
  "imageId": "chester-a-arthur",
  "orderOfOffice": [{ "number": 21, "startYear": 1881, "endYear": 1885 }],
  "funFact": "Chester A. Arthur modernized the U.S. Navy."
},
{
  "id": 22,
  "name": "Grover Cleveland",
  "dateOfBirth": "1837-03-18",
  "party": "Democratic",
  "birthplace": "Caldwell, New Jersey",
  "stateAbbreviation": "NJ",
  "imageId": "grover-cleveland",
  "orderOfOffice": [{ "number": 22, "startYear": 1885, "endYear": 1889 }, { "number": 24, "startYear": 1893, "endYear": 1897 }],
  "funFact": "Grover Cleveland is the only president to serve two non-consecutive terms."
},
{
  "id": 23,
  "name": "Benjamin Harrison",
  "dateOfBirth": "1833-08-20",
  "party": "Republican",
  "birthplace": "North Bend, Ohio",
  "stateAbbreviation": "OH",
  "imageId": "benjamin-harrison",
  "orderOfOffice": [{ "number": 23, "startYear": 1889, "endYear": 1893 }],
  "funFact": "Benjamin Harrison was the first president to use electricity in the White House."
},
{
  "id": 25,
  "name": "William McKinley",
  "dateOfBirth": "1843-01-29",
  "party": "Republican",
  "birthplace": "Niles, Ohio",
  "stateAbbreviation": "OH",
  "imageId": "william-mckinley",
  "orderOfOffice": [{ "number": 25, "startYear": 1897, "endYear": 1901 }],
  "funFact": "William McKinley was the first president to campaign by telephone."
},
{
  "id": 26,
  "name": "Theodore Roosevelt",
  "dateOfBirth": "1858-10-27",
  "party": "Republican",
  "birthplace": "New York City, New York",
  "stateAbbreviation": "NY",
  "imageId": "theodore-roosevelt",
  "orderOfOffice": [{ "number": 26, "startYear": 1901, "endYear": 1909 }],
  "funFact": "Theodore Roosevelt was the first American to win a Nobel Peace Prize."
},
{
  "id": 27,
  "name": "William Howard Taft",
  "dateOfBirth": "1857-09-15",
  "party": "Republican",
  "birthplace": "Cincinnati, Ohio",
  "stateAbbreviation": "OH",
  "imageId": "william-howard-taft",
  "orderOfOffice": [{ "number": 27, "startYear": 1909, "endYear": 1913 }],
  "funFact": "William Howard Taft later served as Chief Justice of the Supreme Court."
},
{
  "id": 28,
  "name": "Woodrow Wilson",
  "dateOfBirth": "1856-12-28",
  "party": "Democratic",
  "birthplace": "Staunton, Virginia",
  "stateAbbreviation": "VA",
  "imageId": "woodrow_wilson",
  "orderOfOffice": [{ "number": 28, "startYear": 1913, "endYear": 1921 }],
  "funFact": "Woodrow Wilson was president during World War I."
},
{
  "id": 29,
  "name": "Warren G. Harding",
  "dateOfBirth": "1865-11-02",
  "party": "Republican",
  "birthplace": "Corsica, Ohio",
  "stateAbbreviation": "OH",
  "imageId": "warren-g-harding",
  "orderOfOffice": [{ "number": 29, "startYear": 1921, "endYear": 1923 }],
  "funFact": "Warren G. Harding was the first sitting president to visit Alaska."
},
{
  "id": 30,
  "name": "Calvin Coolidge",
  "dateOfBirth": "1872-07-04",
  "party": "Republican",
  "birthplace": "Plymouth, Vermont",
  "stateAbbreviation": "VT",
  "imageId": "calvin_coolidge",
  "orderOfOffice": [{ "number": 30, "startYear": 1923, "endYear": 1929 }],
  "funFact": "Calvin Coolidge was sworn in as president by his father, a notary public."
},
{
  "id": 31,
  "name": "Herbert Hoover",
  "dateOfBirth": "1874-08-10",
  "party": "Republican",
  "birthplace": "West Branch, Iowa",
  "stateAbbreviation": "IA",
  "imageId": "herbert-hoover",
  "orderOfOffice": [{ "number": 31, "startYear": 1929, "endYear": 1933 }],
  "funFact": "Herbert Hoover was a successful mining engineer before entering politics."
},
{
  "id": 32,
  "name": "Franklin D. Roosevelt",
  "dateOfBirth": "1882-01-30",
  "party": "Democratic",
  "birthplace": "Hyde Park, New York",
  "stateAbbreviation": "NY",
  "imageId": "franklin-d-roosevelt",
  "orderOfOffice": [{ "number": 32, "startYear": 1933, "endYear": 1945 }],
  "funFact": "Franklin D. Roosevelt is the only U.S. president elected to four terms."
},
{
  "id": 33,
  "name": "Harry S. Truman",
  "dateOfBirth": "1884-05-08",
  "party": "Democratic",
  "birthplace": "Lamar, Missouri",
  "stateAbbreviation": "MO",
  "imageId": "harry-s-truman",
  "orderOfOffice": [{ "number": 33, "startYear": 1945, "endYear": 1953 }],
  "funFact": "Harry S. Truman authorized the use of atomic bombs during World War II."
},
{
  "id": 34,
  "name": "Dwight D. Eisenhower",
  "dateOfBirth": "1890-10-14",
  "party": "Republican",
  "birthplace": "Denison, Texas",
  "stateAbbreviation": "TX",
  "imageId": "dwight-d-eisenhower",
  "orderOfOffice": [{ "number": 34, "startYear": 1953, "endYear": 1961 }],
  "funFact": "Dwight D. Eisenhower was a five-star general in World War II before becoming president."
},
{
  "id": 35,
  "name": "John F. Kennedy",
  "dateOfBirth": "1917-05-29",
  "party": "Democratic",
  "birthplace": "Brookline, Massachusetts",
  "stateAbbreviation": "MA",
  "imageId": "john-f-kennedy",
  "orderOfOffice": [{ "number": 35, "startYear": 1961, "endYear": 1963 }],
  "funFact": "John F. Kennedy was the youngest elected president and the first Catholic president."
},
{
  "id": 36,
  "name": "Lyndon B. Johnson",
  "dateOfBirth": "1908-08-27",
  "party": "Democratic",
  "birthplace": "Stonewall, Texas",
  "stateAbbreviation": "TX",
  "imageId": "lyndon-b-johnson",
  "orderOfOffice": [{ "number": 36, "startYear": 1963, "endYear": 1969 }],
  "funFact": "Lyndon B. Johnson signed the Civil Rights Act into law in 1964."
},
{
  "id": 37,
  "name": "Richard Nixon",
  "dateOfBirth": "1913-01-09",
  "party": "Republican",
  "birthplace": "Yorba Linda, California",
  "stateAbbreviation": "CA",
  "imageId": "richard-nixon",
  "orderOfOffice": [{ "number": 37, "startYear": 1969, "endYear": 1974 }],
  "funFact": "Richard Nixon is the only U.S. president to resign from office."
},
{
  "id": 38,
  "name": "Gerald Ford",
  "dateOfBirth": "1913-07-14",
  "party": "Republican",
  "birthplace": "Omaha, Nebraska",
  "stateAbbreviation": "NE",
  "imageId": "gerald-ford",
  "orderOfOffice": [{ "number": 38, "startYear": 1974, "endYear": 1977 }],
  "funFact": "Gerald Ford is the only president who was not elected as either president or vice president."
},
{
  "id": 39,
  "name": "Jimmy Carter",
  "dateOfBirth": "1924-10-01",
  "party": "Democratic",
  "birthplace": "Plains, Georgia",
  "stateAbbreviation": "GA",
  "imageId": "jimmy-carter",
  "orderOfOffice": [{ "number": 39, "startYear": 1977, "endYear": 1981 }],
  "funFact": "Jimmy Carter won a Nobel Peace Prize in 2002 for his humanitarian work."
},
{
  "id": 40,
  "name": "Ronald Reagan",
  "dateOfBirth": "1911-02-06",
  "party": "Republican",
  "birthplace": "Tampico, Illinois",
  "stateAbbreviation": "IL",
  "imageId": "ronald-reagan",
  "orderOfOffice": [{ "number": 40, "startYear": 1981, "endYear": 1989 }],
  "funFact": "Ronald Reagan was a Hollywood actor before entering politics."
},
{
  "id": 41,
  "name": "George H. W. Bush",
  "dateOfBirth": "1924-06-12",
  "party": "Republican",
  "birthplace": "Milton, Massachusetts",
  "stateAbbreviation": "MA",
  "imageId": "george-h-w-bush",
  "orderOfOffice": [{ "number": 41, "startYear": 1989, "endYear": 1993 }],
  "funFact": "George H. W. Bush was a decorated World War II naval aviator."
},
{
  "id": 42,
  "name": "Bill Clinton",
  "dateOfBirth": "1946-08-19",
  "party": "Democratic",
  "birthplace": "Hope, Arkansas",
  "stateAbbreviation": "AR",
  "imageId": "bill-clinton",
  "orderOfOffice": [{ "number": 42, "startYear": 1993, "endYear": 2001 }],
  "funFact": "Bill Clinton is a talented saxophone player."
},
{
  "id": 43,
  "name": "George W. Bush",
  "dateOfBirth": "1946-07-06",
  "party": "Republican",
  "birthplace": "New Haven, Connecticut",
  "stateAbbreviation": "CT",
  "imageId": "george-w-bush",
  "orderOfOffice": [{ "number": 43, "startYear": 2001, "endYear": 2009 }],
  "funFact": "George W. Bush was the first president with an MBA degree."
},
{
  "id": 44,
  "name": "Barack Obama",
  "dateOfBirth": "1961-08-04",
  "party": "Democratic",
  "birthplace": "Honolulu, Hawaii",
  "stateAbbreviation": "HI",
  "imageId": "barack-obama",
  "orderOfOffice": [{ "number": 44, "startYear": 2009, "endYear": 2017 }],
  "funFact": "Barack Obama was the first African-American president of the United States."
},
{
  "id": 45,
  "name": "Donald Trump",
  "dateOfBirth": "1946-06-14",
  "party": "Republican",
  "birthplace": "Queens, New York",
  "stateAbbreviation": "NY",
  "imageId": "donald-trump",
  "orderOfOffice": [{ "number": 45, "startYear": 2017, "endYear": 2021 }],
  "funFact": "Donald Trump was the first president without prior political or military experience."
},
{
  "id": 46,
  "name": "Joe Biden",
  "dateOfBirth": "1942-11-20",
  "party": "Democratic",
  "birthplace": "Scranton, Pennsylvania",
  "stateAbbreviation": "PA",
  "imageId": "joe-biden",
  "orderOfOffice": [{ "number": 46, "startYear": 2021, "endYear": null }],
  "funFact": "Joe Biden was the youngest senator in U.S. history at age 30."
}
];
  // Quick utility to match president birthdays
  const findActualMatches = (presidents) => {
    const matches = [];
    presidents.forEach((p1, i) => {
      presidents.slice(i + 1).forEach(p2 => {
        if (p1.monthDay === p2.monthDay) {
          matches.push({
            president1: p1,
            president2: p2,
            date: p1.monthDay
          });
        }
      });
    });
    return matches;
  };

  useEffect(() => {
    if (initialized) return;
  
    // Combine preloaded president data
    const allPresidents = _.uniqBy([...PRESIDENTS_DATA], 'id');
  
    // Generate birthdays for all presidents
    const birthdays = allPresidents.map((president) => {
      const date = new Date(president.dateOfBirth);
      return {
        ...president,
        monthDay: `${date.getMonth() + 1}-${date.getDate()}`,
        formattedDate: date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
      };
    });
  
    setPresidentData(birthdays);
  
    if (birthdays.length > 0) {
      setSelectedPresident(birthdays[0]);
    }
  
    const matches = findActualMatches(birthdays);
    setActualMatches(matches);
  
    setInitialized(true);
  }, [PRESIDENTS_DATA]);

 // Combine theoretical, simulated, and actual data for chart rendering  
  const combinedData = generateTheoreticalData().map((item, index) => ({
    groupSize: item.groupSize,
    theoretical: item.probability,
    simulated: simulatedData[index]?.probability || 0,
    actual: item.groupSize >= 23 && item.groupSize <= 46 ? 100 : 0,
  }));
  
  const navigatePresident = (direction) => {
    const currentIndex = presidentData.findIndex(p => p.id === selectedPresident.id);
    const newIndex = direction === 'next' ? 
      (currentIndex + 1) % presidentData.length : 
      (currentIndex - 1 + presidentData.length) % presidentData.length;
    setSelectedPresident(presidentData[newIndex]);
  };

  return (
    <div className="space-y-6 p-6">
        {showConfetti && <Confetti />}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-6 h-6" />
            Birthday Paradox: Theory (think Math) vs. Simulation (think Model) vs. Reality (think Experience)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
  <LineChart
    data={combinedData}
    margin={{ top: 20, right: 30, left: 20, bottom: 50 }} // Add margins
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis
      dataKey="groupSize"
      label={{ value: 'Group Size', position: 'bottom', dy: 10 }} // Add 'dy' for label spacing
    />
    <YAxis
      label={{
        value: 'Probability (%)',
        angle: -90,
        position: 'insideLeft',
        dx: -10, // Adjust spacing for the Y-axis label
      }}
    />
    <Tooltip
      formatter={(value, name) => [
        `${value?.toFixed(2)}%`,
        name.charAt(0).toUpperCase() + name.slice(1),
      ]}
    />
    <Legend
      align="right"
      wrapperStyle={{
        marginTop: '10px', // Add space between the chart and legend
      }}
      formatter={(value) =>
        value.replace('Presidents', '').trim() // Simplify legend text
      }
    />
    <Line
      type="monotone"
      dataKey="theoretical"
      stroke="#8884d8"
      name="Theoretical"
      strokeWidth={2}
    />
    <Line
      type="monotone"
      dataKey="simulated"
      stroke="#82ca9d"
      name="Simulated"
      strokeWidth={2}
    />
    <Line
      type="step"
      dataKey="actual"
      stroke="#ff7300"
      name="Actual"
      strokeWidth={2}
      dot
    />
  </LineChart>
</ResponsiveContainer>

          </div>
        </CardContent>
      </Card>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Users className="w-6 h-6" />
        Probability Comparison at Size {selectedSize}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select Group Size to Win a Prize:</label>
          <input
            type="range"
            min="2"
            max="50"
            value={selectedSize}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setSelectedSize(value);
              if (!hasMovedSlider) {
                setHasMovedSlider(true);
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 5000);
              }
            }}
            className="w-full"
          />
          <div className="text-center text-lg font-semibold mb-2">{selectedSize} Classmates - Presidents - Slide to Change</div>
          {hasMovedSlider ? (
            <div className="text-center">
              <a href="/images/paradoxical-medal.png" download="paradoxical-medal.png" className="text-blue-600 hover:text-blue-800">
                🎉 Download your Presidential Birthday Paradox Medal!
              </a>
            </div>
          ) : (
            <div className="text-center text-gray-600">Move the slider to win a prize!</div>
          )}
        </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-sm text-purple-600">Theoretical</div>
                  <div className="text-2xl font-bold">
                    {theoreticalData[selectedSize - 2]?.probability?.toFixed(2) || '0'}%
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600">Simulated</div>
                  <div className="text-2xl font-bold">
                    {simulatedData[selectedSize - 2]?.probability.toFixed(2)}%
                  </div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="text-sm text-orange-600">Actual</div>
                  <div className="text-2xl font-bold">
                    {selectedSize <= presidentData.length ? 
                      (findActualMatches(presidentData.slice(0, selectedSize)).length > 0 ? '100%' : '0%') : 
                      'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-6 h-6" />
              Presidential Birthday Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Presidential Birthday Match Found! James K. Polk and Warren G. Harding share a birthday on November 2nd. 
                This is the only shared birthday among all U.S. presidents - quite rare given the birthday paradox would predict more matches!
              </div>
              <button
                onClick={() => setShowBirthdayMatches(!showBirthdayMatches)}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {showBirthdayMatches ? 'Hide' : 'Show'} birthday match details
              </button>
              {showBirthdayMatches && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">The November 2nd Connection</h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>• Born 70 years apart (1795 vs 1865)</li>
                    <li>• From different parties (Democratic vs Republican)</li>
                    <li>• Served in different centuries (1845-1849 vs 1921-1923)</li>
                    <li>• Only presidential birthday match in U.S. history!</li>
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Presidential Birthday Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigatePresident('prev')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="flex-1 flex items-center gap-6">
              <div className="w-32 h-32 relative rounded-full border-4 border-blue-200 bg-gray-100 overflow-hidden">
                {selectedPresident?.name && (
                  <img
                    src={presidentImages[selectedPresident.imageId]}
                    alt={selectedPresident.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (!e.target.parentElement.querySelector('.fallback')) {
                        const fallback = document.createElement('div');
                        fallback.className = 'fallback absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-500';
                        fallback.textContent = selectedPresident.name
                          .split(' ')
                          .map(n => n[0])
                          .join('');
                        e.target.parentElement.appendChild(fallback);
                      }
                    }}
                  />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{selectedPresident?.name}</h3>
                <p className="text-gray-600">Birthday: {selectedPresident?.formattedDate}</p>
                <p className="text-gray-600">Party: {selectedPresident?.party}</p>
                <p className="text-gray-600">From: {selectedPresident?.birthplace}</p>
                <p className="mt-2 text-sm text-blue-600 italic">{selectedPresident?.funFact}</p>
              </div>
            </div>

            <button
              onClick={() => navigatePresident('next')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>

    
  );
};

export default BirthdayParadoxGame;
