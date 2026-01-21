<script setup lang="ts">
import { useMessage } from 'naive-ui';
import { ref } from 'vue';
import { Table, Upload, Download } from '@vicons/tabler';
import * as XLSX from 'xlsx';

const message = useMessage();
const headers = ref<string[]>([]);
const rows = ref<any[]>([]);
const fileName = ref('');
const loading = ref(false);

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  loading.value = true;
  fileName.value = file.name;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length > 0) {
        headers.value = jsonData[0] as string[];
        rows.value = jsonData.slice(1);
      }
      loading.value = false;
    } catch (error) {
      console.error(error);
      message.error('Error parsing file.');
      loading.value = false;
    }
  };
  reader.readAsArrayBuffer(file);
};

const exportToCsv = () => {
    if (rows.value.length === 0) return;
    const ws = XLSX.utils.json_to_sheet([headers.value, ...rows.value], { skipHeader: true });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "export.csv");
};

</script>

<template>
  <c-card>
    <div v-if="rows.length === 0" class="p-10 border-2 border-dashed rounded-lg text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" @click="( $refs.fileInput as any )?.click()">
       <input ref="fileInput" type="file" accept=".csv, .xlsx, .xls" hidden @change="handleFileUpload" />
       <n-icon size="48" class="text-gray-400 mb-2">
         <Table />
       </n-icon>
       <p class="text-lg text-gray-500">
         Click or drop CSV/Excel file here
       </p>
       <p class="text-xs text-gray-400 mt-1">Supports .csv, .xlsx, .xls</p>
    </div>

    <div v-else class="space-y-4">
       <div class="flex justify-between items-center">
          <h3 class="font-bold">{{ fileName }}</h3>
          <div class="flex gap-2">
             <c-button secondary @click="( $refs.fileInput as any )?.click()">
                <template #icon><n-icon><Upload /></n-icon></template> New File
             </c-button>
             <c-button primary @click="exportToCsv">
                <template #icon><n-icon><Download /></n-icon></template> Export CSV
             </c-button>
          </div>
       </div>
       
       <div class="overflow-x-auto border rounded-lg">
          <n-table :single-line="false" size="small" striped>
             <thead>
               <tr>
                 <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
               </tr>
             </thead>
             <tbody>
               <tr v-for="(row, rowIndex) in rows.slice(0, 100)" :key="rowIndex">
                 <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
               </tr>
             </tbody>
          </n-table>
          <div v-if="rows.length > 100" class="p-2 text-center text-gray-500 text-xs bg-gray-50 dark:bg-gray-900 border-t">
            Showing first 100 rows of {{ rows.length }}
          </div>
       </div>
    </div>
  </c-card>
</template>
