import Icon from "@/components/Icon";

export default function ForgotPasswordSentPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <Icon name="check-circle" width={124} height={124} />
      <div className="flex flex-col items-center gap-1">
        <span className="text-4xl font-semibold">Request Sent!</span>
        <p className="text-secondary text-lg">
          An email has been sent to you with a reset link.
        </p>
      </div>
    </div>
  );
}
