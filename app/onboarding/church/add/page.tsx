"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// Step components
import Step1Name from "./Step1Name";
import Step2Location from "./Step2Location";
import Step3Type from "./Step3Type";
import Step4Details from "./Step4Details";

export default function AddChurchPage() {
  const router = useRouter();

  // ------------------------------------------------------------
  // STEP SYSTEM
  // ------------------------------------------------------------
  const [step, setStep] = useState(1);

  // All data collected during onboarding:
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    province: "",
    pastor: "",
    street: "",
    area_code: "",
    suburb: "",
    township: "",
    description: "",
    church_type: "",
  });

  const updateForm = (values: any) => {
    setFormData((prev) => ({ ...prev, ...values }));
  };

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  // ------------------------------------------------------------
  // SAVE CHURCH TO SUPABASE
  // ------------------------------------------------------------
  const finish = async () => {
    try {
      // GET logged in user
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;

      if (!user) {
        alert("You must be logged in.");
        return;
      }

      const payload = {
        name: formData.name,
        city: formData.city,
        province: formData.province,
        pastor: formData.pastor,
        street: formData.street,
        area_code: formData.area_code,
        suburb: formData.suburb,
        township: formData.township,
        description: formData.description,
        church_type: formData.church_type,
        created_by: user.id,
      };

      const { error } = await supabase.from("churches").insert(payload);

      if (error) {
        console.error(error);
        alert("Could not save church");
        return;
      }

      // Redirect to dashboard or feed
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Something went wrong saving the church.");
    }
  };

  // ------------------------------------------------------------
  // STEP RENDERING
  // ------------------------------------------------------------
  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      {/* STEP PROGRESS INDICATOR */}
      <div className="flex items-center justify-center gap-3 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-2 w-10 rounded-full transition-all ${
              step >= s ? "bg-blue-600" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* ACTUAL STEPS */}
      {step === 1 && (
        <Step1Name
          value={formData}
          onUpdate={updateForm}
          onNext={next}
        />
      )}

      {step === 2 && (
        <Step2Location
          value={formData}
          onUpdate={updateForm}
          onNext={next}
          onBack={back}
        />
      )}

      {step === 3 && (
        <Step3Type
          value={formData.church_type}
          onUpdate={updateForm}
          onNext={next}
          onBack={back}
        />
      )}

      {step === 4 && (
        <Step4Details
          value={formData}
          onUpdate={updateForm}
          onNext={finish}
          onBack={back}
        />
      )}
    </div>
  );
}
