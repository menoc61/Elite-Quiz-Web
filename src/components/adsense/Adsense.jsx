import React, { useEffect } from 'react';
import config from '../../utils/config';

const AdSense = () => {
  useEffect(() => {
    window.adsbygoogle = window.adsbygoogle || [];
    (adsbygoogle = window.adsbygoogle).push({});
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={config.data_ad_client}
      data-ad-slot={config.data_ad_slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};

export default AdSense;