
"use client";

import Image from 'next/image';
import type { FC } from 'react';

export interface TemplateItemProps {
  id: number;
  title: string;
  imageUrl: string;
  dataAiHint: string; // This will be used as the context for the AI
  templateContent: { // This will pre-populate the fields
    field1?: string;
    field2?: string;
    field3?: string;
  };
  onClick: (template: TemplateItemProps) => void;
}

const TemplateItem: FC<TemplateItemProps> = (props) => {
  const { title, imageUrl, dataAiHint, onClick } = props;
  return (
    <div
      className="flex-shrink-0 w-48 h-36 bg-card border border-border rounded-lg shadow-lg p-3 mx-3 flex flex-col items-center justify-center hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
      onClick={() => onClick(props)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(props);}}
    >
      <div className="w-full h-20 relative mb-2 overflow-hidden rounded-md">
        <Image
          src={imageUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="transform group-hover:scale-105 transition-transform duration-300"
          data-ai-hint={dataAiHint} // This hint remains for potential image search, not for AI context
        />
      </div>
      <p className="text-xs font-medium text-center text-foreground truncate w-full">
        {title}
      </p>
    </div>
  );
};

interface TemplateRowProps {
  templates: TemplateItemProps[];
  direction?: 'left' | 'right';
  speed?: string;
  onTemplateClick: (template: TemplateItemProps) => void;
}

const TemplateRow: FC<TemplateRowProps> = ({ templates, direction = 'left', speed = '30s', onTemplateClick }) => {
  const duplicatedTemplates = [...templates, ...templates, ...templates]; 
  
  const animationClass = direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right';

  return (
    <div className="overflow-hidden w-full my-3">
      <div 
        className={`flex ${animationClass}`} 
        style={{ animationDuration: speed }}
      >
        {duplicatedTemplates.map((template, index) => (
          <TemplateItem key={`${template.id}-${index}`} {...template} onClick={onTemplateClick} />
        ))}
      </div>
    </div>
  );
};

// WhatsApp specific templates
const whatsAppTemplates: Omit<TemplateItemProps, 'onClick'>[] = [
  {
    id: 1,
    title: 'WhatsApp Product Launch',
    imageUrl: 'https://picsum.photos/160/90?random=101',
    dataAiHint: 'WhatsApp marketing new product',
    templateContent: {
      field1: "🚀 Exciting News, {{name}}! 🚀\nWe're thrilled to launch our new *{{product_name}}*!",
      field2: "✨ Features: {{feature1}}, {{feature2}}.\nSpecial launch offer: *{{discount}}% OFF* for 48 hours!",
      field3: "👉 Shop now: {{link}}\nDon't miss out! ⏱️"
    }
  },
  {
    id: 2,
    title: 'WhatsApp Flash Sale',
    imageUrl: 'https://picsum.photos/160/90?random=102',
    dataAiHint: 'WhatsApp marketing flash sale',
    templateContent: {
      field1: "🚨 FLASH SALE ALERT! 🚨\nHey {{name}}! Our *BIGGEST Flash Sale* is ON NOW!",
      field2: "Up to *{{max_discount}}% OFF* on selected items like {{item1}} & {{item2}}.",
      field3: "🛍️ Shop: {{sale_link}}\nEnds in {{duration}}! ⏳"
    }
  },
  {
    id: 3,
    title: 'WhatsApp OTP Verification',
    imageUrl: 'https://picsum.photos/160/90?random=103',
    dataAiHint: 'WhatsApp authentication OTP code',
    templateContent: {
      field1: "🔒 Your One-Time Password (OTP) 🔒",
      field2: "Hi {{name}},\nYour OTP for {{action}} is: ```{{otp_code}}```",
      field3: "Valid for {{validity_duration}}. Do not share it."
    }
  },
  {
    id: 4,
    title: 'WhatsApp Appointment Reminder',
    imageUrl: 'https://picsum.photos/160/90?random=104',
    dataAiHint: 'WhatsApp utility appointment reminder',
    templateContent: {
      field1: "🗓️ Appointment Reminder 🗓️",
      field2: "Hi {{name}},\nReminder for your appointment with {{provider}} for {{service_type}}.",
      field3: "Date: *{{date}}* at *{{time}}*.\nLocation: {{location}}.\nReschedule: {{contact_number}}."
    }
  },
  {
    id: 5,
    title: 'WhatsApp Order Shipped',
    imageUrl: 'https://picsum.photos/160/90?random=105',
    dataAiHint: 'WhatsApp utility order shipped',
    templateContent: {
      field1: "🚚 Your Order #{{order_id}} Has Shipped! 🚚",
      field2: "Great news, {{name}}! Your order is on its way!",
      field3: "Track package: {{tracking_link}}\nEstimated delivery: {{delivery_date}}."
    }
  },
  {
    id: 6,
    title: 'WhatsApp Support Update',
    imageUrl: 'https://picsum.photos/160/90?random=106',
    dataAiHint: 'WhatsApp service support ticket update',
    templateContent: {
      field1: "ℹ️ Support Ticket #{{ticket_id}} Update ℹ️",
      field2: "Hi {{name}},\nYour ticket \"{{ticket_subject}}\" has an update: {{update_summary}}.",
      field3: "Full details: {{portal_link}}\nBest,\n{{company_name}} Support"
    }
  },
  {
    id: 7,
    title: 'WhatsApp Welcome Message',
    imageUrl: 'https://picsum.photos/160/90?random=107',
    dataAiHint: 'WhatsApp service new user welcome',
    templateContent: {
      field1: "👋 Welcome to {{service_name}}, {{name}}! 👋",
      field2: "We're excited to have you on board. Here's how to get started: {{getting_started_link}}",
      field3: "Need help? Contact us at {{support_email}} or visit our FAQ: {{faq_link}}"
    }
  },
   {
    id: 8,
    title: 'WhatsApp Abandoned Cart',
    imageUrl: 'https://picsum.photos/160/90?random=108',
    dataAiHint: 'WhatsApp marketing abandoned cart reminder',
    templateContent: {
      field1: "🛒 Still thinking it over, {{name}}? 🛒",
      field2: "We noticed you left some items in your cart, including the *{{product_in_cart}}*.",
      field3: "Complete your purchase with a special *{{discount_offer}}% discount* just for you! Use code: ```{{discount_code}}```\nCheckout: {{cart_link}}"
    }
  }
];

// To fill the gallery, we can duplicate or use a subset if more than 21 are defined.
// For now, let's ensure we have at least 7, the gallery component will duplicate them.
const displayTemplates = whatsAppTemplates.slice(0, 8); // Use the 8 defined templates

interface TemplateGalleryProps {
  onTemplateClick: (template: TemplateItemProps) => void;
}

const TemplateGallery: FC<TemplateGalleryProps> = ({ onTemplateClick }) => {
  return (
    <div className="pt-6 border-t border-border mt-6">
      <h3 className="text-xl font-semibold text-center mb-6 text-primary">
        Explore WhatsApp FormFlow Templates
      </h3>
      <TemplateRow templates={displayTemplates.slice(0, 7) as TemplateItemProps[]} direction="left" speed="60s" onTemplateClick={onTemplateClick} />
      <TemplateRow templates={displayTemplates.slice(1, 8).length >=1 ? displayTemplates.slice(1,8) as TemplateItemProps[] : displayTemplates.slice(0,1) as TemplateItemProps[] } direction="right" speed="75s" onTemplateClick={onTemplateClick} />
      <TemplateRow templates={displayTemplates.slice(0, 7) as TemplateItemProps[]} direction="left" speed="65s" onTemplateClick={onTemplateClick} />
    </div>
  );
};

export default TemplateGallery;

