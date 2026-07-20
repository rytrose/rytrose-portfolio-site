
import S3Image from "../../components/S3Image";
import Button from "../../components/Button";

const Shower = () => {
  return (
    <div className="flex flex-col items-center gap-8 px-4 py-12">
      <h1 className="font-serif text-4xl text-center">We're having a baby!</h1>
      <p className="font-sans text-md text-center">Thank you for celebrating with us. Please RSVP at the link below.</p>

      <Button
        border
        onClick={() => window.open("https://docs.google.com/forms/d/e/1FAIpQLSdL_Jr_oeKyhG7hE79-uSh4O7JPbhdp1QyAjWPwjNYGHuARog/viewform?usp=publish-editor", "_blank")}
        className="font-sans font-semibold text-lg !text-slate-700 hover:!text-blue-800 active:!text-slate-900 !border-slate-500 hover:!border-blue-600 active:!border-slate-800"
      >
        RSVP here
      </Button>

      <div className="flex flex-col items-center gap-4">
        <h2 className="font-serif text-2xl text-center">Parking</h2>
        <p className="font-sans text-md text-center">We live on a small circle, so you'll park nearby and walk to our house.<br/>See the map below for the best places to park. Set your GPS destination to "Walsh Middle School".</p>
        <div className="inline-flex overflow-hidden rounded-3xl">
        <S3Image
        path="/PARTY MAP-cropped.png"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAIAAADETxJQAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAMUlEQVR4nGM4e2La7EmpP96tZ+idH6xvzmQdKMHAIMEQGWGlacXOkFrqP39+zdr1nQBKUg8T8mL3TAAAAABJRU5ErkJggg=="
        alt="Parking map"
        width={Math.floor(372 * 1.25)}
        height={Math.floor(505 * 1.25)}
        />
        </div>
      </div>
    </div>
  );
};

Shower.hideHeaderFooter = true;

export default Shower;
