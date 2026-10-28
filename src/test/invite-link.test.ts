import { describe, expect, it } from "vitest";
import { decodeInvite, encodeInvite, toWeddingData } from "@/lib/invite-link";

const input = { groom: "Sardor", bride: "Gulnoza", date: "2027-05-20T18:30", venueName: "Oqsaroy", address: "Toshkent", dressCode: "", notes: "", message: "", photo: 1 };

describe("invite link", () => {
  it("round-trips Uzbek text through the link", () => {
    expect(decodeInvite(encodeInvite({ ...input, venueName: "Navro‘z" }))?.venueName).toBe("Navro‘z");
  });
  it("rejects broken links", () => {
    expect(decodeInvite("garbage!!")).toBeNull();
  });
  it("builds Uzbek date label and Tashkent time", () => {
    const w = toWeddingData(input);
    expect(w.dateLabel).toBe("20 may 2027");
    expect(w.date).toBe("2027-05-20T18:30:00+05:00");
  });
  it("old links without type stay wedding invitations", () => {
    expect(toWeddingData(input).heading).toBe("Nikoh to‘yi taklifnomasi");
  });
  it("sunnat to'yi shows one name and its own heading", () => {
    const w = toWeddingData({ ...input, type: "sunnat", groom: "Abdulloh" });
    expect(w.heading).toBe("Sunnat to‘yi taklifnomasi");
    expect(w.bride).toBe("");
  });
});
