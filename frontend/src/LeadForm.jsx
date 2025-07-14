// LeadForm.jsx
import React, { useState } from "react";
import axios from "axios";

const LeadForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    credit_score: 700,
    income: 500000,
    clicks: 3,
    time_on_site: 4,
    age_group: "26-35",
    family_background: "Single",
    city_tier: "T1",
    comments: "",
    consent: false,
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.consent) return alert("Consent is required.");

    const { consent, ...payload } = formData;

    try {
      const res = await axios.post("https://your-render-api-url/score", payload);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("API Error");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Lead Intent Scorer</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="email" placeholder="Email" onChange={handleChange} className="border w-full p-2" />
        <input name="credit_score" type="number" onChange={handleChange} placeholder="Credit Score" className="border w-full p-2" />
        <input name="income" type="number" onChange={handleChange} placeholder="Income" className="border w-full p-2" />
        <input name="clicks" type="number" onChange={handleChange} placeholder="Clicks" className="border w-full p-2" />
        <input name="time_on_site" type="number" onChange={handleChange} placeholder="Time on Site" className="border w-full p-2" />
        <select name="age_group" onChange={handleChange} className="border w-full p-2">
          <option value="18-25">18-25</option>
          <option value="26-35">26-35</option>
          <option value="36-50">36-50</option>
          <option value="51+">51+</option>
        </select>
        <select name="family_background" onChange={handleChange} className="border w-full p-2">
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Married with Kids">Married with Kids</option>
        </select>
        <select name="city_tier" onChange={handleChange} className="border w-full p-2">
          <option value="T1">Tier 1</option>
          <option value="T2">Tier 2</option>
          <option value="T3">Tier 3</option>
        </select>
        <textarea name="comments" onChange={handleChange} placeholder="Comments" className="border w-full p-2" />
        <label className="block">
          <input type="checkbox" name="consent" onChange={handleChange} />
          I consent to data processing.
        </label>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Score Lead</button>
      </form>

      {result && (
        <div className="mt-4 p-4 border">
          <p><strong>Initial Score:</strong> {result.initial_score}</p>
          <p><strong>Re-ranked Score:</strong> {result.reranked_score}</p>
          <p><strong>Comments:</strong> {result.comments}</p>
        </div>
      )}
    </div>
  );
};

export default LeadForm;
