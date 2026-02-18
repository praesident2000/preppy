import { useEffect, useRef, useState } from "react";
import Label from "../Label/Label";
import Step1 from "../Step1/Step1";
import Step2 from "../Step2/Step2";
import Step3 from "../Step3/Step3";
import Step4 from "../Step4/Step4";
import Navigation from "../Navigation/Navigation";
import Summary from "../Summary/Summary";
import styles from "./Calculator.module.scss";

function Calculator() {
   // Navigation
   const [currentStep, setCurrentStep] = useState<number>(1);
   const onPrev = () => {
      if (currentStep > 1) setCurrentStep((s) => s - 1);
   };
   const onNext = () => {
      if (currentStep < 4) setCurrentStep((s) => s + 1);
   };

   // Step1
   const [step1Value, setStep1Value] = useState<string | null>(null);

   // Step2
   const [days, setDays] = useState<number>(7);
   const [people, setPeople] = useState<number>(1);

   // Step3
   const [step3Value, setStep3Value] = useState<string[]>([]);
   const [extra, setExtra] = useState<boolean>(false);
   const [medications, setMedications] = useState<string | null>(null);

   // Step4
   const setUrl = async () => {
      const url = new URL(window.location.href);
      url.search = "";

      if (step1Value) url.searchParams.set("step1", step1Value);
      if (days) url.searchParams.set("days", days.toString());
      if (people) url.searchParams.set("people", people.toString());
      if (step3Value.length > 0) url.searchParams.set("step3", step3Value.join(",") || "");
      if (medications) url.searchParams.set("medications", medications);

      try {
         await navigator.clipboard.writeText(url.toString());
      } catch (err) {
         console.log("Failed to copy: ", err);
      }
      alert("URL kopiert!");
   };

   // Summary
   const summaryRef = useRef<HTMLDivElement>(null!);

   // On first render: Check URL Params
   useEffect(() => {
      const currentUrl = new URL(window.location.href);
      if(currentUrl.searchParams.size > 0) setCurrentStep(4)

      const step1UrlParams = currentUrl.searchParams.get("step1");
      const daysUrlParams = currentUrl.searchParams.get("days");
      const peopleUrlParams = currentUrl.searchParams.get("people");
      const step3UrlParams = currentUrl.searchParams.get("step3");
      const medicationsUrlParams = currentUrl.searchParams.get("medications");

      if (step1UrlParams) setStep1Value(step1UrlParams);
      if (daysUrlParams) setDays(parseInt(daysUrlParams));
      if (peopleUrlParams) setPeople(parseInt(peopleUrlParams));
      if (step3UrlParams) setStep3Value(step3UrlParams.split(","));
      if (medicationsUrlParams) {
         setExtra(true);
         setMedications(medicationsUrlParams);
      }
   }, []);

   return (
      <div className={styles.calculator}>
         {/* Label */}
         <Label currentStep={currentStep} />

         {/* Steps */}
         {currentStep === 1 && (
            <Step1 step1Value={step1Value} setStep1Value={setStep1Value} />
         )}
         {currentStep === 2 && (
            <Step2
               days={days}
               setDays={setDays}
               people={people}
               setPeople={setPeople}
            />
         )}
         {currentStep === 3 && (
            <Step3
               step3Value={step3Value}
               setStep3Value={setStep3Value}
               extra={extra}
               setExtra={setExtra}
               medications={medications}
               setMedications={setMedications}
            />
         )}
         {currentStep === 4 && <Step4 step3Value={step3Value} />}

         {/* Nav */}
         <Navigation
            currentStep={currentStep}
            onPrev={onPrev}
            onNext={onNext}
            setUrl={setUrl}
            summaryRef={summaryRef}
         />

         {/* Print */}
         <Summary 
            summaryRef={summaryRef}
            step1Value={step1Value}
            days={days}
            people={people}
            step3Value={step3Value}
            medications={medications}
         />
      </div>
   );
}

export default Calculator;
