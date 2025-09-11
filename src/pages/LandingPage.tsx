import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SectionContainer from "../components/layout/SectionContainer";
import FeatureCard from "../components/FeatureCard";
import { GrStar } from "react-icons/gr";
import { IoMdCog } from "react-icons/io";
import { GiWaterDrop } from "react-icons/gi";
import JaggedBox from "../components/layout/JaggedBox";

const iconFeatures = [
  {
    icon: <GrStar />,
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    description:
      "Curabitur sem augue, placerat hendrerit aliquam in, rhoncus et ipsum. Aenean a est urna. Sed vel ex accumsan, aliquam tellus viverra eleifend nisl.",
    stroke: 0.5,
  },
  {
    icon: <IoMdCog />,
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    description:
      "Curabitur sem augue, placerat hendrerit aliquam in, rhoncus et ipsum. Aenean a est urna. Sed vel ex accumsan, aliquam tellus viverra eleifend nisl.",
    stroke: 8,
  },
  {
    icon: <GiWaterDrop />,
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    description:
      "Curabitur sem augue, placerat hendrerit aliquam in, rhoncus et ipsum. Aenean a est urna. Sed vel ex accumsan, aliquam tellus viverra eleifend nisl.",
    stroke: 8,
  },
];

function LandingPage() {
  return (
    <>
      <Header />
      <Link
        to="/report"
        className="px-8 py-3 mt-8 font-bold rounded-md bg-primary-blue text-black hover:bg-sky-300"
      >
        Go to Analyzer
      </Link>
      <main className="">
        <section>
          <SectionContainer title="">
            <div className="text-quaternary-red font-bold font-orbitron p-16 text-center">
              <h1 className="text-4xl leading-snug">
                Lorem ipsum dolor sit amet, <br />
                consectetur adipiscing elit.
              </h1>
              <p className="text-xs w-1/2 mx-auto text-justify">
                Curabitur sem augue, placerat hendrerit aliquam in, rhoncus et
                ipsum. Aenean a est urna. Sed vel ex accumsan, aliquam tellus
                viverra, eleifend nisl. Sed viverra bibendum tortor. Proin
                imperdiet mauris vel nulla lacinia, et gravida est porttitor.
                Nunc id malesuada tellus. Nullam et arcu ligula. Lorem ipsum
                dolor sit amet, consectetur adipiscing elit. Curabitur sem
                augue, placerat hendrerit aliquam in, rhoncus et ipsum. Aenean a
                est urna. Sed vel ex accumsan, aliquam tellus viverra, eleifend
                nisl. Sed viverra bibendum tortor. Proin imperdiet mauris vel
                nulla lacinia, et gravida est porttitor. Nunc id malesuada
                tellus. Nullam et arcu ligula
              </p>
            </div>
          </SectionContainer>
        </section>
        <section>
          <div className="flex p-16 px-4 justify-between items-center">
            <div className="w-1/2 text-quaternary-red font-bold font-orbitron pl-10">
              <h1 className="text-4xl leading-snug">
                Lorem ipsum dolor sit amet, <br />
                consectetur adipiscing elit.
              </h1>
              <div className="text-xs w-3/4">
                <p className="text-justify mt-4 mb-4">
                  Curabitur sem augue, placerat hendrerit aliquam in, rhoncus et
                  ipsum. Aenean a est urna. Sed vel ex accumsan, aliquam tellus
                  viverra, eleifend nisl. Sed viverra bibendum tortor. Proin
                  imperdiet mauris vel nulla lacinia, et gravida est porttitor.
                  Nunc id malesuada tellus. Nullam et arcu ligula.
                </p>
                <ul className="list-disc">
                  <li>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </li>
                  <li>
                    Curabitur sem augue, placerat hendrerit aliquam in, rhoncus
                    et ipsum
                  </li>
                  <li>
                    Aenean a est urna. Sed vel ex accumsan, aliquam tellus
                    viverra, eleifend nisl.
                  </li>
                  <li>
                    Sed viverra bibendum tortor. Proin imperdiet mauris vel
                    nulla lacinia, et gravida est porttitor. Nunc id malesuada
                    tellus. Nullam et arcu ligula.
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-3/7 pl-8">
              <SectionContainer title="">
                <img
                  src="0.png"
                  alt="Placeholder"
                  className="w-full h-auto"
                />
              </SectionContainer>
            </div>
          </div>
        </section>
        <section>
          <div className="flex p-16 px-4 justify-between items-center">
            <div className="w-3/7 pr-8">
              <SectionContainer title="">
                <img
                  src="1.png"
                  alt="Placeholder"
                  className="w-full h-auto"
                />
              </SectionContainer>
            </div>

            <div className="w-1/2 text-quaternary-red font-bold font-orbitron pl-10">
              <h1 className="text-4xl leading-snug">
                Lorem ipsum dolor sit amet, <br />
                consectetur adipiscing elit.
              </h1>
              <div className="text-xs w-3/4">
                <p className="text-justify mt-4 mb-4">
                  Curabitur sem augue, placerat hendrerit aliquam in, rhoncus et
                  ipsum. Aenean a est urna. Sed vel ex accumsan, aliquam tellus
                  viverra, eleifend nisl. Sed viverra bibendum tortor. Proin
                  imperdiet mauris vel nulla lacinia, et gravida est porttitor.
                  Nunc id malesuada tellus. Nullam et arcu ligula.
                </p>
                <ul className="list-disc">
                  <li>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </li>
                  <li>
                    Curabitur sem augue, placerat hendrerit aliquam in, rhoncus
                    et ipsum
                  </li>
                  <li>
                    Aenean a est urna. Sed vel ex accumsan, aliquam tellus
                    viverra, eleifend nisl.
                  </li>
                  <li>
                    Sed viverra bibendum tortor. Proin imperdiet mauris vel
                    nulla lacinia, et gravida est porttitor. Nunc id malesuada
                    tellus. Nullam et arcu ligula.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className="p-16 pt-0 pb-37">
          <div className="flex justify-around gap-8">
            {iconFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                stroke={feature.stroke}
              />
            ))}
          </div>
        </section>
        <section className="bg-[#2d110f] p-4 -mb-4 pb-12 pt-10">
          <div className="flex gap-1 mx-12 mb-6">
            <div
              id="multi-jagged"
              className="w-40 border-2 border-[#652821] bg-[#361519]"
            ></div>
            <JaggedBox className="text-quaternary-red" type="lighter">
              <div className="flex justify-between ml-12 ">
                <div className="self-center">
                  <h1 className="uppercase text-7xl font-orbitron text-primary-blue text-center">
                    Call to <br />
                    action
                  </h1>
                  <div className="flex mt-10 gap-12 font-orbitron text-primary-blue font-bold">
                    <JaggedBox className="w-72 h-16 flex text-center m-auto leading-16">
                      Test
                    </JaggedBox>
                    <JaggedBox className="w-72 h-16 flex text-center leading-16">
                      Test
                    </JaggedBox>
                  </div>
                </div>
                <img className="w-2/5 p-4" src="2.png" alt="" />
              </div>
            </JaggedBox>
          </div>
          <div className="flex justify-center items-center gap-5 p-1 px-4 font-bold bg-[#2d110f] mt-12">
            <a href="/">
              <div className="flex flex-col items-center justify-center w-18 h-18 gap-1 rounded-full bg-primary-blue ">
                <span className="block w-12  h-[7.2px] bg-secondary-red rounded-full"></span>
                <span className="block w-12  h-[7px] bg-secondary-red rounded-full"></span>
                <span className="block w-12  h-[7px] bg-secondary-red rounded-full"></span>
              </div>
            </a>

            <h1 className="text-8xl text-primary-blue pt-0.5 font-rajdhani">IaC - Tirith</h1>
          </div>
        </section>
      </main>
      <Footer className="pb-8" />
    </>
  );
}

export default LandingPage;
