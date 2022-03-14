<script>
import { goto } from "@roxi/routify";
import { toast } from "@zerodevx/svelte-toast";
import { theme } from "../../../constants/toastTheme";
import { onMount } from "svelte";
import { getAllKYCPending } from "../../../services/admin";
import { claim_svg_element } from "svelte/internal";
import { _ } from "svelte-i18n";
let kycList = [];
let numberStatus = "default";
let alphabetStatus = "default";
let dateStatus = "default";
let kycStatus = "default";
let pageStatus = 1;
let sort = {
  numberStatus,
  alphabetStatus,
  dateStatus,
  kycStatus,
  pageStatus,
};

let storeKycList = [];

const sortKycList = async () => {
  kycList = storeKycList;
  if (pageStatus != sort.pageStatus) sortPage();
  if (kycStatus != sort.kycStatus) sortKyc();
  if (dateStatus != sort.dateStatus) sortDate();
  if (alphabetStatus != sort.alphabetStatus) sortAlphabet();
  if (numberStatus != sort.numberStatus) sortNumber();

  sort = {
    numberStatus: sort.numberStatus == numberStatus ? "default" : numberStatus,
    alphabetStatus:
      sort.alphabetStatus == alphabetStatus ? "default" : alphabetStatus,
    dateStatus: sort.dateStatus == dateStatus ? "default" : dateStatus,
    kycStatus: sort.kycStatus == kycStatus ? "default" : kycStatus,
    pageStatus,
  };

  numberStatus = sort.numberStatus;
  alphabetStatus = sort.alphabetStatus;
  dateStatus = sort.dateStatus;
  kycStatus = sort.kycStatus;
};

const sortPage = () => {
  kycList = kycList.slice(
    pageStatus == 1 ? 0 : (pageStatus - 1) * 5,
    pageStatus * 5
  );
};

const sortKyc = () => {
  sortPage();
  kycList = kycList.filter((item) =>
    kycStatus == "verified"
      ? item.approved_date != null
      : item.approved_date == null
  );
};

const sortDate = () => {
  sortPage();
  kycList = kycList.sort((a, b) => {
    if (dateStatus == "oldest") {
      return a.updatedAt > b.updatedAt ? 1 : -1;
    } else {
      return a.updatedAt < b.updatedAt ? 1 : -1;
    }
  });
};

const sortAlphabet = () => {
  sortPage();
  kycList = kycList.sort((a, b) => {
    if (alphabetStatus == "asc") {
      return a.firstName > b.firstName ? 1 : -1;
    } else {
      return a.firstName < b.firstName ? 1 : -1;
    }
  });
};

const sortNumber = () => {
  sortPage();
  kycList = kycList.sort((a, b) => {
    if (numberStatus == "asc") {
      return a.idCardNo > b.idCardNo ? 1 : -1;
    } else {
      return a.idCardNo < b.idCardNo ? 1 : -1;
    }
  });
};

onMount(async () => {
  const res = await getAllKYCPending();
  if (res.success) storeKycList = res.kyc_list;
  else toast.push("Fail to get KYC list", theme.error);
  await sortKycList();
  sortPage();
});
</script>

<div class="flex w-screen justify-center items-center">
  <div
    class="flex flex-row w-3/5 content-center self-center justify-center items-center px-4 py-2 my-10 mx-12"
  >
    <table>
      <tr class="px-8 py-4 bg-purple-500 text-2xl text-white">
        <th class="px-10 py-4">ID Card Number</th>
        <th class="px-8 py-4">Full Name</th>
        <th class="px-20 py-4">Last Modified</th>
        <th class="px-8 py-4">Status</th>
        <th></th>
      </tr>
      {#key sort}
        {#each kycList as kyc}
          <tr class="text-center bg-purple-50 ">
            <td class="py-4 tracking-widest">{kyc.idCardNo}</td>
            <td class="py-4">{kyc.firstName + " " + kyc.lastName}</td>
            <td class="py-4"
              >{new Date(kyc.updatedAt).toLocaleDateString() +
                " " +
                new Date(kyc.updatedAt).toLocaleTimeString()}</td
            >
            <td
              class="{kyc.approved_date == null
                ? 'text-red-400 font-bold py-4'
                : 'text-green-500 font-bold py-4'}"
              >{kyc.approved_date == null ? "UNVERIFIED" : "VERIFIED"}</td
            >
            <td class="px-8 py-4"
              ><button
                class=" bg-yellow-400 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                on:click="{() =>
                  $goto(`/admin/kycVerify/edit/${kyc.userId}`)}"
              >
                EDIT 🔧
              </button></td
            >
          </tr>
        {/each}
      {/key}
      <tr class="bg-green-50 text-center">
        <td class="py-4 text-center">
          <select
            class="px-4 py-2"
            name="numberStatus"
            id="numberStatus"
            bind:value="{numberStatus}"
            on:change="{() => {
              sortKycList();
            }}"
          >
            <option value="default" disabled selected>DEFAULT</option>
            <option value="asc">ASCENDING</option>
            <option value="desc">DESCENDING</option>
          </select>
        </td>
        <td>
          <select
            class="px-8 py-2"
            name="alphabetStatus"
            id="alphabetStatus"
            bind:value="{alphabetStatus}"
            on:change="{() => {
              sortKycList();
            }}"
          >
            <option value="default" disabled selected>DEFAULT</option>
            <option value="asc">A - Z</option>
            <option value="desc">Z - A</option>
          </select>
        </td>
        <td>
          <select
            class="px-8 py-2"
            name="dateStatus"
            id="dateStatus"
            bind:value="{dateStatus}"
            on:change="{() => {
              sortKycList();
            }}"
          >
            <option value="default" disabled selected>DEFAULT</option>
            <option value="oldest">OLDEST</option>
            <option value="newest">NEWEST</option>
          </select>
        </td>
        <td>
          <select
            class="px-4 py-2"
            name="kycStatus"
            id="kycStatus"
            bind:value="{kycStatus}"
            on:change="{() => {
              sortKycList();
            }}"
          >
            <option value="default" disabled selected>DEFAULT</option>
            <option value="unverified">UNVERIFIED</option>
            <option value="verified">VERIFIED</option>
          </select>
        </td>
        <td class="py-4 text-center">
          <select
            class="px-4 py-2"
            name="page"
            id="page"
            bind:value="{pageStatus}"
            on:change="{() => {
              sortKycList();
            }}"
          >
            {#each Array(Math.ceil(storeKycList.length / 5)) as _, i}
              <option value="{i + 1}">PAGE {i + 1}</option>
            {/each}
          </select>
        </td>
      </tr>
    </table>
  </div>
</div>
