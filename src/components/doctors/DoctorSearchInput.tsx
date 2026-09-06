"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2, UserCheck, Stethoscope } from "lucide-react";
import { useSearchDoctor } from "@/hooks/doctorRegistration/useSearchDoctor";
import { DoctorSearchResult } from "@/types/doctorRegistration";
import Cookies from "js-cookie";

interface DoctorSearchInputProps {
  onSelectDoctor: (doctor: DoctorSearchResult) => void;
  selectedDoctor?: DoctorSearchResult | null;
  placeholder?: string;
  className?: string;
}

// Fallback mock data for local demonstration / UI testing when hospital ID is not present
const MOCK_DOCTORS: DoctorSearchResult[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    email: "doctor@example.com",
    first_name: "Cornelius",
    last_name: "De Houtman",
    sip_number: "35041120392003",
    specialty: "Poli anak",
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    email: "olivia@untitledui.com",
    first_name: "Olivia",
    last_name: "Rhye",
    sip_number: "SIP-3174-2026-001",
    specialty: "Kandungan",
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    email: "budi@example.com",
    first_name: "Budi",
    last_name: "Santoso",
    sip_number: "SIP-3174-2026-002",
    specialty: "Penyakit Dalam",
  },
];

export function DoctorSearchInput({
  onSelectDoctor,
  selectedDoctor,
  placeholder = "Cari ID Dokter, Nama, SIP, atau Email...",
  className = "",
}: DoctorSearchInputProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hospitalId = Cookies.get("hospitalId") || "";

  const { data: searchData, isLoading } = useSearchDoctor(
    hospitalId,
    { identity: query, email: query, sip_number: query },
    query.length >= 2
  );

  // Parse API search results or fallback to mock
  const results: DoctorSearchResult[] = (() => {
    if (searchData) {
      if (Array.isArray(searchData)) return searchData;
      return [searchData];
    }
    if (query.length >= 2) {
      const q = query.toLowerCase();
      return MOCK_DOCTORS.filter(
        (doc) =>
          doc.first_name.toLowerCase().includes(q) ||
          doc.last_name.toLowerCase().includes(q) ||
          doc.email.toLowerCase().includes(q) ||
          doc.sip_number.toLowerCase().includes(q) ||
          doc.id.toLowerCase().includes(q)
      );
    }
    return [];
  })();

  useEffect(() => {
    if (selectedDoctor) {
      setQuery(`${selectedDoctor.first_name} ${selectedDoctor.last_name}`);
    }
  }, [selectedDoctor]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (doc: DoctorSearchResult) => {
    setQuery(`${doc.first_name} ${doc.last_name}`);
    onSelectDoctor(doc);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="pl-10 pr-10 py-3 h-12 bg-gray-50/50 border-gray-200 rounded-xl text-sm focus-visible:ring-[#3BB49F]"
        />
        {isLoading && (
          <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3BB49F] animate-spin" />
        )}
      </div>

      {/* Auto-complete Dropdown Menu */}
      {isOpen && query.length >= 2 && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto divide-y divide-gray-100">
          {results.length > 0 ? (
            results.map((doc) => (
              <div
                key={doc.id}
                onClick={() => handleSelect(doc)}
                className="p-3.5 hover:bg-[#EBF8F5] transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#D8F0EC] flex items-center justify-center text-[#3BB49F] font-bold text-xs">
                    {doc.first_name[0]}
                    {doc.last_name ? doc.last_name[0] : ""}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-[#3BB49F] transition-colors">
                      {doc.first_name} {doc.last_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      SIP: {doc.sip_number} • {doc.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#3BB49F] font-medium bg-[#EBF8F5] px-2.5 py-1 rounded-md">
                  <Stethoscope className="h-3.5 w-3.5" />
                  <span>{doc.specialty}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-gray-500 flex flex-col items-center gap-1">
              <UserCheck className="h-6 w-6 text-gray-300" />
              <span>Dokter tidak ditemukan</span>
              <span className="text-xs text-gray-400">
                Pastikan nama, email, atau SIP sesuai.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
