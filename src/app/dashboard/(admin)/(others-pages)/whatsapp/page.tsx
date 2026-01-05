'use client';

import { useState, useEffect } from 'react';
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataTableCard from '@/components/common/DataTableCard';
import Button from '@/components/ui/button/Button';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import DataTable from '@/components/tables/DataTable';

type QRResponse = {
  status: 'NOT_STARTED' | 'QR' | 'READY';
  qr: string | null;
};

async function fetchSessions() {
  const res = await fetch(`/api/whatsapp`, {
    cache: "no-store",
  });
  const json = await res.json();
  console.log(json, "fetch session");

  // adapt to the existing shape if necessary
  return json.list ?? json;
}

const WhatsAppPage = () => {
  const [whatsappData, setWhatsappData] = useState<QRResponse | null>(null);
  // const [whatsappData, setWhatds] = useState([]);
  // const whatsappData = fetchSessions();
  const [accountId, setAccountId] = useState<string>('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (accountId) {
      const timer = setInterval(async () => {
        const res = await fetch(
          `http://localhost:3001/api/whatsapp/session?sessionId=${accountId}`
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

  };

  const sendMessage = async () => {
    // if (!accountId || !to || !message) return;
    // await fetch('/api/whatsapp/send', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ accountId, to, message }),
    // });
  };

  const logout = async () => {
    if (!accountId) return;
    await fetch('/api/whatsapp/session/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId }),
    });
    setAccountId('');
  };

  const header = [

    {
      header: "Phone",
      accessorKey: "ContactNo",
    },
    {
      header: "Status",
      accessorKey: "Status",
    },
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="WhatsApp" />
      <div className="space-y-6">
        {/* <DataTableCard
          title="WhatsApp Instance"
          headerActions={
            <div className="flex items-center gap-3">
              <Button size="sm" variant="primary" onClick={startSession}>
                Create Whatsapp Session
              </Button>
              {accountId && (
                <Button size="sm" variant="outline" onClick={() => setConfirmOpen(true)}>
                  Logout
                </Button>
              )}
              <ConfirmDialog
                isOpen={confirmOpen}
                title="Confirm Logout"
                description="Are you sure you want to logout this WhatsApp session?"
                onConfirm={async () => { await logout(); setConfirmOpen(false); }}
                onCancel={() => setConfirmOpen(false)}
                confirmText="Logout"
                cancelText="Cancel"
              />
            </div>
          }
        >
          {whatsappData && whatsappData.status === 'NOT_STARTED' && <p>Starting session…</p>}

          {whatsappData && whatsappData.status === 'QR' && whatsappData.qr && (
            <>
              <p>Scan QR Code</p>
              <img src={whatsappData.qr} alt="QR" />
            </>
          )}

          {whatsappData && whatsappData.status === 'READY' && <p>✅ WhatsApp logged in</p>}
          <DataTable columns={header} data={whatsappData} pagination pageIndex={pageIndex} pageSize={pageSize} onPageIndexChange={setPageIndex} onPageSizeChange={setPageSize} />
        </DataTableCard> */}
        <DataTableCard title="Whatsapp List" showPagination totalPages={totalPages} totalItems={totalItems} initialPageSize={10}
          onPageChange={async (pageIndex, pageSize) => {
            setLoading(true);
            try {
              const res = await fetch(`/api/whatsapp?page=${pageIndex + 1}&size=${pageSize}`, { cache: 'no-store' });
              const json = await res.json();
              const items = json.list ?? json.items ?? json;
              console.log(items, `next click page data`);

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
        >
          {({ pageIndex, pageSize, setPageIndex, setPageSize }: any) => (
            <>
              {loading ? <div>Loading...</div> : <DataTable columns={header} data={data} pagination pageIndex={pageIndex} pageSize={pageSize} onPageIndexChange={setPageIndex} onPageSizeChange={setPageSize} />}
            </>
          )}
        </DataTableCard>
      </div>
    </div>
  );
};

export default WhatsAppPage;
