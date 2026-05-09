import CountUp from "react-countup";

export function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  return (
    <CountUp
      start={0}
      end={value}
      duration={2.5}
      separator=","
      decimals={decimals}
      prefix={prefix}
      suffix={suffix}
      preserveValue
    />
  );
}
