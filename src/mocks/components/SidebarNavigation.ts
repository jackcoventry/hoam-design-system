const items = [
  {
    id: 'orders',
    label: 'Orders',
    items: [
      {
        id: 'orders-overview',
        label: 'My Orders',
        href: '/account/orders',
      },
      {
        id: 'order-returns',
        label: 'Returns & Refunds',
        href: '/account/returns',
      },
      {
        id: 'order-tracking',
        label: 'Track an Order',
        href: '/account/track-order',
      },
    ],
  },
  {
    id: 'profile',
    label: 'Profile',
    items: [
      {
        id: 'profile-details',
        label: 'Personal Details',
        href: '/account/profile',
      },
      {
        id: 'addresses',
        label: 'Addresses',
        href: '/account/addresses',
      },
      {
        id: 'payment-methods',
        label: 'Payment Methods',
        href: '/account/payment-methods',
      },
    ],
  },
  {
    id: 'membership',
    label: 'Membership',
    items: [
      {
        id: 'loyalty',
        label: 'Loyalty Points',
        href: '/account/loyalty',
      },
      {
        id: 'subscriptions',
        label: 'Subscriptions',
        href: '/account/subscriptions',
      },
      {
        id: 'rewards',
        label: 'Rewards & Perks',
        href: '/account/rewards',
      },
    ],
  },
  {
    id: 'security',
    label: 'Security',
    items: [
      {
        id: 'login-security',
        label: 'Login & Security',
        href: '/account/security',
      },
      {
        id: 'two-factor',
        label: 'Two-Factor Authentication',
        href: '/account/security/2fa',
      },
      {
        id: 'devices',
        label: 'Recognised Devices',
        href: '/account/security/devices',
      },
    ],
  },
  {
    id: 'support',
    label: 'Support',
    items: [
      {
        id: 'help-centre',
        label: 'Help Centre',
        href: '/help',
      },
      {
        id: 'contact-support',
        label: 'Contact Support',
        href: '/account/support',
      },
      {
        id: 'faq',
        label: 'Frequently Asked Questions',
        href: '/account/faq',
      },
    ],
  },
  {
    id: 'legal',
    label: 'Legal',
    items: [
      {
        id: 'privacy',
        label: 'Privacy Settings',
        href: '/account/privacy',
      },
      {
        id: 'terms',
        label: 'Terms & Conditions',
        href: '/legal/terms',
      },
      {
        id: 'data',
        label: 'Request My Data',
        href: '/account/data-request',
      },
    ],
  },
];

export default items;
