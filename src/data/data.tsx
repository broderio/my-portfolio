import {
  AcademicCapIcon,
  ArrowDownTrayIcon,
  BuildingOffice2Icon,
  CalendarIcon,
  MapIcon,
} from '@heroicons/react/24/outline';

import GithubIcon from '../components/Icon/GithubIcon';
import InstagramIcon from '../components/Icon/InstagramIcon';
import LinkedInIcon from '../components/Icon/LinkedInIcon';
import XIcon from '../components/Icon/XIcon';
import heroImage from '../images/header-background.jpg';
import porfolioImage1 from '../images/portfolio/portfolio-1.jpg';
import porfolioImage2 from '../images/portfolio/portfolio-2.jpg';
import porfolioImage3 from '../images/portfolio/portfolio-3.jpg';
import porfolioImage4 from '../images/portfolio/portfolio-4.jpg';
import porfolioImage5 from '../images/portfolio/portfolio-5.jpg';
import porfolioImage6 from '../images/portfolio/portfolio-6.jpg';
import porfolioImage7 from '../images/portfolio/portfolio-7.jpg';
import porfolioImage8 from '../images/portfolio/portfolio-8.jpg';
import porfolioImage9 from '../images/portfolio/portfolio-9.jpg';
import porfolioImage10 from '../images/portfolio/portfolio-10.jpg';
import porfolioImage11 from '../images/portfolio/portfolio-11.jpg';
import profilepic from '../images/profilepic.jpg';
import {
  About,
  ContactSection,
  ContactType,
  Hero,
  HomepageMeta,
  PortfolioItem,
  SkillGroup,
  Social,
  TimelineItem,
} from './dataDef';

/**
 * Page meta data
 */
export const homePageMeta: HomepageMeta = {
  title: 'Broderick Riopelle Personal Website',
  description: "The personal website of Broderick Riopelle",
};

/**
 * Section definition
 */
export const SectionId = {
  Hero: 'hero',
  About: 'about',
  Contact: 'contact',
  Portfolio: 'portfolio',
  Resume: 'resume',
  Skills: 'skills',
  Stats: 'stats',
} as const;

export type SectionId = (typeof SectionId)[keyof typeof SectionId];

/**
 * Hero section
 */
export const heroData: Hero = {
  imageSrc: heroImage,
  name: `I'm Broderick Riopelle`,
  description: (
    <>
      <p className="prose-sm text-stone-200 sm:prose-base lg:prose-lg">
        I'm an Ann Arbor based <strong className="text-stone-100">Robotics Engineer</strong>, currently working
        at the <strong className="text-stone-100">University of Michigan</strong> helping build open-source,
        interoperable software to support undergraduate robotics education.
      </p>
    </>
  ),
  actions: [
    {
      href: '/assets/resume.pdf',
      text: 'Resume',
      primary: true,
      Icon: ArrowDownTrayIcon,
    },
    {
      href: `#${SectionId.Contact}`,
      text: 'Contact',
      primary: false,
    },
  ],
};

/**
 * About section
 */
export const aboutData: About = {
  profileImageSrc: profilepic,
  description: `I'm an engineer interested in developing impactful solutions to help uplift the communities around me. I
  enjoy traveling to national parks, watching Lion's football, and making homemade bagels.
  `,
  aboutItems: [
    { label: 'Location', text: 'Ann Arbor, MI', Icon: MapIcon },
    { label: 'Age', text: '23', Icon: CalendarIcon },
    { label: 'Study', text: 'University of Michigan', Icon: AcademicCapIcon },
    { label: 'Employment', text: 'University of Michigan', Icon: BuildingOffice2Icon },
  ],
};

/**
 * Skills section
 */
export const skills: SkillGroup[] = [
  {
    name: 'Systems & Low-Level Programming',
    skills: [
      { name: 'C', level: 10 },
      { name: 'C++', level: 10 },
      { name: 'Rust', level: 6 },
      { name: 'Linux', level: 10 },
      { name: 'PCB Design', level: 7 },
    ],
  },
  {
    name: 'High-Level Programming & Scripting',
    skills: [
      { name: 'Python', level: 10 },
      { name: 'Javascript', level: 8 },
      { name: 'TypeScript', level: 8 },
      { name: 'C#', level: 7 },
      { name: 'MATLAB', level: 6 },
    ],
  },
  {
    name: 'Data & Robotics',
    skills: [
      { name: 'Data Pipeline Optimization', level: 9 },
      { name: 'SLAM', level: 8 },
      { name: 'Computer Vision', level: 7 },
      { name: 'GPU Programming', level: 7 },
      { name: 'Digital Signal Processing', level: 6 },
    ],
  }
];


/**
 * Portfolio section
 */
export const portfolioItems: PortfolioItem[] = [
  {
    title: 'Project title 1',
    description: 'Give a short description of your project here.',
    url: 'https://reactresume.com',
    image: porfolioImage1,
  },
  {
    title: 'Project title 2',
    description: 'Give a short description of your project here.',
    url: 'https://reactresume.com',
    image: porfolioImage2,
  },
  {
    title: 'Project title 3',
    description: 'Give a short description of your project here.',
    url: 'https://reactresume.com',
    image: porfolioImage3,
  },
  {
    title: 'Project title 4',
    description: 'Give a short description of your project here.',
    url: 'https://reactresume.com',
    image: porfolioImage4,
  },
  {
    title: 'Project title 5',
    description: 'Give a short description of your project here.',
    url: 'https://reactresume.com',
    image: porfolioImage5,
  },
  {
    title: 'Project title 6',
    description: 'Give a short description of your project here.',
    url: 'https://reactresume.com',
    image: porfolioImage6,
  },
  {
    title: 'Project title 7',
    description: 'Give a short description of your project here.',
    url: 'https://reactresume.com',
    image: porfolioImage7,
  },
  {
    title: 'Project title 8',
    description: 'Give a short description of your project here.',
    url: 'https://reactresume.com',
    image: porfolioImage8,
  },
  {
    title: 'Project title 9',
    description: 'Give a short description of your project here.',
    url: 'https://reactresume.com',
    image: porfolioImage9,
  },
  {
    title: 'Project title 10',
    description: 'Give a short description of your project here.',
    url: 'https://reactresume.com',
    image: porfolioImage10,
  },
  {
    title: 'Project title 11',
    description: 'Give a short description of your project here.',
    url: 'https://reactresume.com',
    image: porfolioImage11,
  },
];

/**
 * Resume section -- TODO: Standardize resume contact format or offer MDX
 */
export const education: TimelineItem[] = [
  {
    date: 'May 2024',
    location: 'University of Michigan',
    title: 'BSE in Computer Engineering',
    content: <p>I attended the University of Michigan from August 2020 through May 2024. My coursework focused on
      embedded systems, computer vision, and autonomous robotics. I was a member of the Perot Jain TechLab at MCity
      2023 cohort and the Michigander EV & Mobility Scholars Program.
    </p>,
  }
];

// ### Software Engineer Intern, Link Engineering <span class="spacer"></span> May 2022 &mdash; April 2023
// - Integrated support for Python script uploads for custom analytics on Link's database platform using IronPython
// - Constructed a TypeScript linear algebra library tailored for computer graphics applications
// - Developed a flexible CSV to Link data format conversion API, enhancing the database's usability and accommodating diverse customer datasets

// Technologies: Data Pipeline, UX Design, Typescript, C\#

export const experience: TimelineItem[] = [
  {
    date: 'May 2024 - Present',
    location: 'University of Michigan',
    title: 'Robotics Engineer',
    content: (
      <p>
        I have designed and built the Robot Interprocess eXchange (RIX), a full robot operating
        system modeled after ROS that lets undergraduate students create and test robotics applications in the
        classroom. I have maintained large software projects by creating modular, testable interfaces and integrating
        unit testing frameworks to ensure reliability and streamline automated grading for instructors. I also mentored
        several teams of interns over two summers, guiding them through robotics software and firmware projects from
        concept to implementation.
      </p>
    ),
  },
  {
    date: 'May 2023 - August 2023',
    location: 'Ford Motor Company',
    title: 'Low-Speed Autonomy Intern',
    content: (
      <p>
        I engineered a high-performance data pipeline for surround view camera systems, enabling efficient neural
        network training and validation. By leveraging multi-threading, I accelerated the transformation of compressed
        images into pixel arrays for concurrent processing. I also optimized color correction algorithms in Python
        through vectorized DSP techniques, significantly improving computational efficiency.
      </p>
    ),
  },
  {
    date: 'January 2023 - December 2023',
    location: 'Retrospect Technologies',
    title: 'Student Researcher',
    content: (
      <p>
        I collaborated with Perot-Jain TechLab at MCity to evaluate and quantify autonomous vehicle risk metrics. This
        involved designing high-risk driving scenarios for experimental validation at the MCity test facility and
        collecting RTK-GPS data from autonomous vehicles using Dataspeed NavRoute to provide empirical support for risk
        analyses.
      </p>
    ),
  },
  {
    date: 'May 2022 - April 2023',
    location: 'Link Engineering',
    title: 'Software Engineer Intern',
    content: (
      <p>
        I enhanced Link's database platform by integrating support for Python script uploads using IronPython, enabling 
        custom analytics. I also built a TypeScript linear algebra library specifically for computer graphics 
        applications and developed a flexible API to convert CSV files into Link's data format, improving usability and
        supporting a wide range of customer datasets.
      </p>
    ),
  },
  {
    date: 'May 2021 - April 2024',
    location: 'University of Michigan',
    title: 'Instructional Aide',
    content: (
      <p>
        I developed asynchronous APIs for mobile robots, enabling undergraduate students to implement SLAM, motion
        planning, and computer vision algorithms. I designed MCU-based PCBs to reduce robot cost and offload processing
        to the cloud, and authored firmware to integrate data from LiDAR, cameras, IMUs, and wheel encoders into the
        mobile robot ecosystem.
      </p>
    ),
  },
];

/**
 * Contact section
 */

export const contact: ContactSection = {
  headerText: 'Get in touch.',
  description: 'Feel free to reach out!',
  items: [
    {
      type: ContactType.Email,
      text: 'riopellebroderick@gmail.com',
      href: 'mailto:riopellebroderick@gmail.com',
    },
    {
      type: ContactType.Instagram,
      text: '@broderick.riopelle',
      href: 'https://www.instagram.com/broderick.riopelle/',
    },
    {
      type: ContactType.Github,
      text: 'broderio',
      href: 'https://github.com/broderio',
    },
  ],
};

/**
 * Social items
 */
export const socialLinks: Social[] = [
  { label: 'Github', Icon: GithubIcon, href: 'https://github.com/broderio' },
  { label: 'LinkedIn', Icon: LinkedInIcon, href: 'https://www.linkedin.com/in/broderick-riopelle/' },
  { label: 'Instagram', Icon: InstagramIcon, href: 'https://www.instagram.com/broderick.riopelle/' },
  { label: 'X', Icon: XIcon, href: 'https://x.com/broderickr00' },
];
