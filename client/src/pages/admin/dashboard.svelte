<script>
import { toast } from "@zerodevx/svelte-toast";
import { theme } from "../../constants/toastTheme";
import { onMount } from "svelte";
import { getAllKYCPending } from "../../services/admin";
import { goto } from "@roxi/routify";
let kycList = [];
onMount(async () => {
  const res = await getAllKYCPending();
  if (res.success) kycList = res.kyc_list;
  else toast.push("Fail to get KYC list", theme.error);
});
</script>

<div
  id="main"
  class="main-content flex-1 bg-gray-100 mt-12 md:mt-2 pb-24 md:pb-5"
>
  <div class="bg-gray-800 pt-3">
    <div
      class="rounded-tl-3xl bg-gradient-to-r from-blue-900 to-gray-800 p-4 shadow text-2xl text-white"
    >
      <h1 class="font-bold pl-2">Admin Dashboard</h1>
    </div>
  </div>

  <div class="flex flex-wrap">
    <div class="w-full md:w-1/2 xl:w-1/3 p-6">
      <!--Metric Card-->
      <div
        class="bg-gradient-to-b from-green-200 to-green-100 border-b-4 border-green-600 rounded-lg shadow-xl p-5"
      >
        <div class="flex flex-row items-center">
          <div class="flex-shrink pr-4">
            <div class="rounded-full p-5 bg-green-600">
              <i class="fa fa-wallet fa-2x fa-inverse"></i>
            </div>
          </div>
          <div class="flex-1 text-right md:text-center">
            <h2 class="font-bold uppercase text-gray-600">TOTAL USERS</h2>
            <p class="font-bold text-3xl">
              329 <span class="text-green-500"
                ><i class="fas fa-caret-up"></i></span
              >
            </p>
          </div>
        </div>
      </div>
      <!--/Metric Card-->
    </div>
    <div class="w-full md:w-1/2 xl:w-1/3 p-6">
      <!--Metric Card-->
      <div
        class="bg-gradient-to-b from-pink-200 to-pink-100 border-b-4 border-pink-500 rounded-lg shadow-xl p-5 cursor-pointer"
        on:click="{() => $goto('/admin/kycVerify')}"
      >
        <div class="flex flex-row items-center">
          <div class="flex-shrink pr-4">
            <div class="rounded-full p-5 bg-pink-600">
              <i class="fas fa-users fa-2x fa-inverse"></i>
            </div>
          </div>
          <div class="flex-1 text-right md:text-center">
            <h2 class="font-bold uppercase text-gray-600">KYC PENDING</h2>
            <p class="font-bold text-3xl">
              {kycList.length}
              <span class="text-pink-500"
                ><i class="fas fa-exchange-alt"></i></span
              >
            </p>
          </div>
        </div>
      </div>
      <!--/Metric Card-->
    </div>
    <div class="w-full md:w-1/2 xl:w-1/3 p-6">
      <!--Metric Card-->
      <div
        class="bg-gradient-to-b from-yellow-200 to-yellow-100 border-b-4 border-yellow-600 rounded-lg shadow-xl p-5"
      >
        <div class="flex flex-row items-center">
          <div class="flex-shrink pr-4">
            <div class="rounded-full p-5 bg-yellow-600">
              <i class="fas fa-user-plus fa-2x fa-inverse"></i>
            </div>
          </div>
          <div class="flex-1 text-right md:text-center">
            <h2 class="font-bold uppercase text-gray-600">New Users</h2>
            <p class="font-bold text-3xl">
              2 <span class="text-yellow-600"
                ><i class="fas fa-caret-up"></i></span
              >
            </p>
          </div>
        </div>
      </div>
      <!--/Metric Card-->
    </div>
    <div class="w-full md:w-1/2 xl:w-1/3 p-6">
      <!--Metric Card-->
      <div
        class="bg-gradient-to-b from-blue-200 to-blue-100 border-b-4 border-blue-500 rounded-lg shadow-xl p-5"
      >
        <div class="flex flex-row items-center">
          <div class="flex-shrink pr-4">
            <div class="rounded-full p-5 bg-blue-600">
              <i class="fas fa-server fa-2x fa-inverse"></i>
            </div>
          </div>
          <div class="flex-1 text-right md:text-center">
            <h2 class="font-bold uppercase text-gray-600">Server Uptime</h2>
            <p class="font-bold text-3xl">152 days</p>
          </div>
        </div>
      </div>
      <!--/Metric Card-->
    </div>
    <div class="w-full md:w-1/2 xl:w-1/3 p-6">
      <!--Metric Card-->
      <div
        class="bg-gradient-to-b from-indigo-200 to-indigo-100 border-b-4 border-indigo-500 rounded-lg shadow-xl p-5"
      >
        <div class="flex flex-row items-center">
          <div class="flex-shrink pr-4">
            <div class="rounded-full p-5 bg-indigo-600">
              <i class="fas fa-tasks fa-2x fa-inverse"></i>
            </div>
          </div>
          <div class="flex-1 text-right md:text-center">
            <h2 class="font-bold uppercase text-gray-600">TOTAL STORES</h2>
            <p class="font-bold text-3xl">7 tasks</p>
          </div>
        </div>
      </div>
      <!--/Metric Card-->
    </div>
    <div class="w-full md:w-1/2 xl:w-1/3 p-6">
      <!--Metric Card-->
      <div
        class="bg-gradient-to-b from-red-200 to-red-100 border-b-4 border-red-500 rounded-lg shadow-xl p-5"
      >
        <div class="flex flex-row items-center">
          <div class="flex-shrink pr-4">
            <div class="rounded-full p-5 bg-red-600">
              <i class="fas fa-inbox fa-2x fa-inverse"></i>
            </div>
          </div>
          <div class="flex-1 text-right md:text-center">
            <h2 class="font-bold uppercase text-gray-600">Issues</h2>
            <p class="font-bold text-3xl">
              3 <span class="text-red-500"><i class="fas fa-caret-up"></i></span
              >
            </p>
          </div>
        </div>
      </div>
      <!--/Metric Card-->
    </div>
  </div>

  <div class="flex flex-row flex-wrap flex-grow mt-2">
    <div class="w-full md:w-1/2 xl:w-1/3 p-6">
      <!--Graph Card-->
      <div class="bg-white border-transparent rounded-lg shadow-xl">
        <div
          class="bg-gradient-to-b from-gray-300 to-gray-100 uppercase text-gray-800 border-b-2 border-gray-300 rounded-tl-lg rounded-tr-lg p-2"
        >
          <h class="font-bold uppercase text-gray-600">Graph</h>
        </div>
        <div class="p-5">
          <div class="chartjs-size-monitor">
            <div class="chartjs-size-monitor-expand"><div class=""></div></div>
            <div class="chartjs-size-monitor-shrink"><div class=""></div></div>
          </div>
          <canvas
            id="chartjs-7"
            class="chartjs chartjs-render-monitor"
            width="402"
            height="201"
            style="display: block; width: 402px; height: 201px;"></canvas>
        </div>
      </div>
      <!--/Graph Card-->
    </div>

    <div class="w-full md:w-1/2 xl:w-1/3 p-6">
      <!--Graph Card-->
      <div class="bg-white border-transparent rounded-lg shadow-xl">
        <div
          class="bg-gradient-to-b from-gray-300 to-gray-100 uppercase text-gray-800 border-b-2 border-gray-300 rounded-tl-lg rounded-tr-lg p-2"
        >
          <h2 class="font-bold uppercase text-gray-600">Graph</h2>
        </div>
        <div class="p-5">
          <div class="chartjs-size-monitor">
            <div class="chartjs-size-monitor-expand"><div class=""></div></div>
            <div class="chartjs-size-monitor-shrink"><div class=""></div></div>
          </div>
          <canvas
            id="chartjs-0"
            class="chartjs chartjs-render-monitor"
            width="402"
            height="201"
            style="display: block; width: 402px; height: 201px;"></canvas>
        </div>
      </div>
      <!--/Graph Card-->
    </div>
    <div class="w-full md:w-1/2 xl:w-1/3 p-6">
      <!--Graph Card-->
      <div class="bg-white border-transparent rounded-lg shadow-xl">
        <div
          class="bg-gradient-to-b from-gray-300 to-gray-100 uppercase text-gray-800 border-b-2 border-gray-300 rounded-tl-lg rounded-tr-lg p-2"
        >
          <h2 class="font-bold uppercase text-gray-600">Graph</h2>
        </div>
        <div class="p-5">
          <div class="chartjs-size-monitor">
            <div class="chartjs-size-monitor-expand"><div class=""></div></div>
            <div class="chartjs-size-monitor-shrink"><div class=""></div></div>
          </div>
          <canvas
            id="chartjs-0"
            class="chartjs chartjs-render-monitor"
            width="402"
            height="201"
            style="display: block; width: 402px; height: 201px;"></canvas>
        </div>
      </div>
      <!--/Graph Card-->
    </div>
  </div>
</div>
