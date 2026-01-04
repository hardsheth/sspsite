'use client';

import { useState, useEffect } from 'react';
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataTableCard from '@/components/common/DataTableCard';
import Button from '@/components/ui/button/Button';

type QRResponse = {
  status: 'NOT_STARTED' | 'QR' | 'READY';
  qr: string | null;
};

const WhatsAppPage = () => {
  const [data, setData] = useState<QRResponse | null>(null);
  const [accountId, setAccountId] = useState<string>('');

  useEffect(() => {
    if (accountId) {
      const timer = setInterval(async () => {
        const res = await fetch(
          `http://localhost:3001/api/whatsapp?sessionId=${accountId}`
        );
        const json = await res.json();
        setData(json);
      }, 2000);

      return () => clearInterval(timer);
    }
  }, [accountId]);

  const startSession = async () => {
    const res = await fetch('/api/whatsapp', {
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
    await fetch('/api/whatsapp/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId }),
    });
    setAccountId('');
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="WhatsApp" />
      <div className="space-y-6">
        {/* <ComponentCard title="WhatsApp Instance">
          <div className="space-y-4">
            <div>
              <p>Account ID: {accountId || 'Not created yet'}</p>
            </div>
            <div>
              <p>Status: {status}</p>
              {error && <p className="text-red-500">Error: {error}</p>}
              {qrCode && (
                <div>
                  <p>Scan this QR code with WhatsApp:</p>
                  <img src={qrCode} alt="QR Code" />
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              {!qrCode && <button
                onClick={startSession}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Create Session
              </button>}
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">To</label>
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Send Message
            </button>
          </div>
        </ComponentCard> */}
        <DataTableCard title="WhatsApp Instance">
          <div className="flex justify-end">
            <Button size="sm" variant="primary" onClick={startSession}>
              Create Whatsapp Session
            </Button>
          </div>
          {data&&data.status === 'NOT_STARTED' && <p>Starting session…</p>}

          {data&&data.status === 'QR' && data.qr && (
            <>
              <p>Scan QR Code</p>
              <img src={data.qr} alt="QR" />
            </>
          )}

          {data&&data.status === 'READY' && <p>✅ WhatsApp logged in</p>}

        </DataTableCard>
      </div>
    </div>
  );
};

export default WhatsAppPage;
