'use client';

import { useState, useEffect } from 'react';
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataTableCard from '@/components/common/DataTableCard';
import Button from '@/components/ui/button/Button';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import DataTable from '@/components/tables/DataTable';
import { FiEye } from "react-icons/fi";
import { MdOutlineDelete } from "react-icons/md";
import { Modal } from '@/components/ui/modal';
import WhatsAppMessageForm from '@/components/whatsapp/WhatsAppMessageForm';

type QRResponse = {
  status: 'NOT_STARTED' | 'QR' | 'READY';
  qr: string | null;
};

interface StatusLabelProps {
  status: StatusEnum;
}

export enum StatusEnum {
  PENDING = "pending",
  COMPLETE = "complete",
  CONNECTED = "connected",
  FAILED = "failed",
  REQUESTED = "requested",
  PROGRESS = "in_progress",
}

export const STATUS_LABEL_CLASSES: Record<StatusEnum, string> = {
  [StatusEnum.PENDING]:
    "border border-pink-500 text-pink-600 bg-pink-50 dark:bg-pink-500/10 dark:text-pink-400",

  [StatusEnum.COMPLETE]:
    "border border-indigo-500 text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400",

  [StatusEnum.CONNECTED]:
    "border border-green-500 text-green-600 bg-green-50 dark:bg-green-500/10 dark:text-green-400",

  [StatusEnum.FAILED]:
    "border border-red-500 text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400",

  [StatusEnum.REQUESTED]:
    "border border-orange-500 text-orange-600 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-400",

  [StatusEnum.PROGRESS]:
    "border border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400",
};


// export const statusLabelClasses: Record<string, string> = {
//   completed:
//     "border border-indigo-500 text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400",

//   failed:
//     "border border-orange-500 text-orange-600 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-400",

//   successful:
//     "border border-green-500 text-green-600 bg-green-50 dark:bg-green-500/10 dark:text-green-400",

//   pending:
//     "border border-pink-500 text-pink-600 bg-pink-50 dark:bg-pink-500/10 dark:text-pink-400",

//   active:
//     "border border-lime-500 text-lime-600 bg-lime-50 dark:bg-lime-500/10 dark:text-lime-400",

//   inactive:
//     "border border-gray-300 text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-300",
// };


export function StatusLabel({ status }: StatusLabelProps) {
  const key = status.toLowerCase();

  return (
    <span
      className={`
        inline-flex items-center
        px-3 py-1
        text-sm font-medium
        rounded-md
        whitespace-nowrap capitalize
        ${STATUS_LABEL_CLASSES[status]}
      `}
    >
      {status}
    </span>
  );
}


const WhatsAppPage = () => {
  async function fetchSessions() {
    const res = await fetch(`/api/whatsapp`, {
      cache: "no-store",
    });
    const json = await res.json();
    console.log(json, "fetch session");
    const items = json.list ?? json.items ?? json;
    setData(items || []);
    // try to read total pages count if available (pageCount or totalPages),
    // otherwise compute from total items if provided
    const serverPageCount = json.pageCount ?? json.totalPages ?? json.page_count ?? undefined;
    if (typeof serverPageCount === 'number') {
      setTotalPages(serverPageCount);
    }
    return json.list ?? json;
  }
  const [whatsappData, setWhatsappData] = useState<QRResponse | null>(null);
  // const [whatsappData, setWhatds] = useState([]);
  // const whatsappData = fetchSessions();
  const [accountId, setAccountId] = useState<string>('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [displayCode, setDisplayCode] = useState(false);
  const [messageForm, setMessageForm] = useState(false);

  useEffect(() => {
    if (accountId) {
      const timer = setInterval(async () => {
        const res = await fetch(
          `/api/whatsapp/session?sessionId=${accountId}`
        );
        const json = await res.json();
        setWhatsappData(json);
      }, 2000);

      return () => clearInterval(timer);
    }
  }, [accountId]);

  const startSession = async () => {
    const res = await fetch('/api/whatsapp/session', {
      method: 'POST',
    });
    const data = await res.json();
    console.log(data, 'data');

    setAccountId(data.sessionId);
    await fetchSessions();
  };

  const sendMessage = async (data: any) => {
    console.log(`whatsapp message data`, data, `accountId`, accountId);

    if (!accountId) return;
    const formData = new FormData();
    // for (const [key, value] of Object.entries(data)) {
    //   console.log(key, 'key', value, 'value');

    //   if (value instanceof File) {
    //     formData.append(key, value, value.name);
    //   } else {
    //     formData.append(key, String(value) as any);
    //   }
    // }
    formData.append('message', data.message);
    formData.append('contactNumbers', data.contactNumbers.join(','));

    // Loop through the nested 'file' object
    Object.values(data.file).forEach((file) => {
      // Append every file to the SAME key 'files'
      formData.append('files', file as Blob); ;
    });
    await fetch(`/api/whatsapp/session/${accountId}`, {
      method: 'POST',
      // body: JSON.stringify({ accountId, to, message }),
      body: formData,
    });
  };

  const logout = async () => {
    if (!accountId) return;
    await fetch(
      `/api/whatsapp/session?sessionId=${accountId}`, {
      method: "DELETE",
    });
    setAccountId('');
    await fetchSessions();
  };

  const signout = async () => {
    if (!accountId) return;
    await fetch(
      `/api/whatsapp/session/${accountId}`, {
      method: "DELETE",
    });
    setAccountId('');
    await fetchSessions();
  };

  const header = [

    {
      header: "Phone",
      accessorKey: "ContactNo",
    },
    {
      header: "Status",
      accessorKey: "Status",
      cell: ({ getValue }: any) => (
        <StatusLabel status={getValue() as StatusEnum} />
      ),
    },
    {
      header: "Action",
      accessorKey: "_id",
      cell: ({ row }: any) => {
        const data = row.original;
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="primary" startIcon={<FiEye />} onClick={async () => {
              setAccountId(data.SessionId);
              setDisplayCode(true);
              await fetch(
                `/api/whatsapp/session?sessionId=${data.SessionId}&setSession=true`
              );
            }}>
              {''}
            </Button>
            <Button size="sm" variant="danger" startIcon={<MdOutlineDelete />} onClick={async () => {
              setAccountId(data.SessionId);
              setConfirmOpen(true);

            }}>
              {''}
            </Button>
            {data.Status === 'connected' && <Button size="sm" variant="primary" onClick={() => { setMessageForm(true); setAccountId(data.SessionId); }} >
              Message Form
            </Button>}
            {data.Status === 'connected' && <Button size="sm" variant="danger" startIcon={<MdOutlineDelete />} onClick={async () => {
              setAccountId(data.SessionId);
              setConfirmOpen(true);

            }}>
              Log Out
            </Button>}
          </div>
        );
      }
    }
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="WhatsApp" />
      <div className="space-y-6">
        <DataTableCard title="Whatsapp List" showPagination totalPages={totalPages} totalItems={totalItems} initialPageSize={10}
          onPageChange={async (pageIndex, pageSize) => {
            setLoading(true);
            try {
              const res = await fetch(`/api/whatsapp?page=${pageIndex + 1}&size=${pageSize}`, { cache: 'no-store' });
              const json = await res.json();
              const items = json.list ?? json.items ?? json;
              setData(items || []);
              // try to read total pages count if available (pageCount or totalPages),
              // otherwise compute from total items if provided
              const serverPageCount = json.pageCount ?? json.totalPages ?? json.page_count ?? undefined;
              if (typeof serverPageCount === 'number') {
                setTotalPages(serverPageCount);
              } else if (typeof json.total === 'number') {
                setTotalPages(Math.max(1, Math.ceil(json.total / pageSize)));
              } else {
                // fallback: if items length returned and fewer than requested, approximate
                setTotalPages(prev => Math.max(1, prev || Math.ceil((Array.isArray(items) ? items.length : 0) / pageSize)));
              }
              // total items (record count) if provided by API
              const totalFromApi = json.total ?? json.totalItems ?? json.count ?? undefined;
              if (typeof totalFromApi === 'number') setTotalItems(totalFromApi);
              else if (Array.isArray(items)) setTotalItems(prev => prev || items.length);
            } finally { setLoading(false); }
          }}
          headerActions={
            <ConfirmDialog
              isOpen={confirmOpen}
              title="Confirm Delete Session"
              description="Are you sure you want to logout this WhatsApp session?"
              onConfirm={async () => { await logout(); setConfirmOpen(false); }}
              onCancel={() => setConfirmOpen(false)}
              confirmText="Logout"
              cancelText="Cancel"
            />
          }
          modalOnly={
            <Modal isOpen={displayCode} onClose={() => { setDisplayCode(false) }} showCloseButton={true} className="max-w-md p-6">
              {/* {whatsappData && whatsappData.status === 'NOT_STARTED' && <p>Starting session…</p>} */}
              {whatsappData && whatsappData.qr && (
                <>
                  <p>Scan QR Code</p>
                  {/* {whatsappData.qr} */}
                  <img src={whatsappData.qr} alt="QR" />
                </>
              )}
            </Modal>
          }
        >
          {({ pageIndex, pageSize, setPageIndex, setPageSize }: any) => (
            <>
              <div className="text-end">
                <Button size="sm" variant="primary" onClick={startSession}>
                  Create Whatsapp Session
                </Button>
              </div>
              {loading ? <div>Loading...</div> : <DataTable columns={header} data={data} pagination pageIndex={pageIndex} pageSize={pageSize} onPageIndexChange={setPageIndex} onPageSizeChange={setPageSize} />}
            </>
          )}
        </DataTableCard>
        <Modal isOpen={messageForm} onClose={() => { setMessageForm(false) }} showCloseButton={true} className="max-w-md p-6">
          <div className="">
            <h4 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">Send Messae</h4>
            <WhatsAppMessageForm onCancel={() => { setMessageForm(false) }} onConfirm={sendMessage} />

          </div>
        </Modal>
        <ConfirmDialog
          isOpen={confirmLogout}
          title="Confirm Log Out"
          description="Are you sure you want to logout this WhatsApp session?"
          onConfirm={async () => { await signout(); setConfirmLogout(false); }}
          onCancel={() => setConfirmLogout(false)}
          confirmText="Logout"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default WhatsAppPage;
