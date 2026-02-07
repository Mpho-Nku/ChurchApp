"use client";

import { useState } from "react";
import Step1Name from "./Step1Name";
import Step2Location from "./Step2Location";
import Step3Type from "./Step3Type";
import Step4Details from "./Step4Details";
import Step5Image from "./Step5Image";
import StepReview from "./StepReview";

export default function ChurchOnboarding() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    pastorName: "",
    location: "", // mapped to township
    churchType: "",
    description: "",
    images: [],
  });

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  return (
    <>
      {step === 1 && (
        <Step1Name formData={formData} setFormData={setFormData} next={next} />
      )}
      {step === 2 && (
        <Step2Location
          formData={formData}
          setFormData={setFormData}
          next={next}
          back={back}
        />
      )}
      {step === 3 && (
        <Step3Type
          formData={formData}
          setFormData={setFormData}
          next={next}
          back={back}
        />
      )}
      {step === 4 && (
        <Step4Details
          formData={formData}
          setFormData={setFormData}
          next={next}
          back={back}
        />
      )}
      {step === 5 && (
        <Step5Image
          formData={formData}
          setFormData={setFormData}
          next={next}
          back={back}
        />
      )}
      {step === 6 && <StepReview formData={formData} back={back} />}
    </>
  );
}
