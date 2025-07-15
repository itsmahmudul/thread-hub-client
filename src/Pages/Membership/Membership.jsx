import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import useAuth from "../../Hooks/useAuth";
import { toast } from "react-toastify";
import { FaCheckCircle, FaStar } from "react-icons/fa";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { Player } from "@lottiefiles/react-lottie-player";
import goldStarAnimation from "../../assets/lotties/Star Badge.json";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ email, onSuccess, darkMode }) => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosPublic();
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setProcessing(true);
        try {
            const { data } = await axiosSecure.post("/payment/create-payment-intent", {
                amount: 1000,
                email,
            });

            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: { email },
                },
            });

            if (result.error) {
                toast.error(result.error.message);
                setProcessing(false);
            } else if (result.paymentIntent.status === "succeeded") {
                toast.success("Payment successful! You are now a Gold Member.");
                await onSuccess();
                setProcessing(false);
            }
        } catch (err) {
            console.error(err);
            toast.error("Payment failed. Please try again.");
            setProcessing(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={`max-w-md mx-auto space-y-4 p-4 border rounded shadow ${darkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-white text-gray-900"
                }`}
        >
            <CardElement options={{ style: { base: { fontSize: "16px", color: darkMode ? "#fff" : "#000" } } }} />
            <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded disabled:opacity-50"
            >
                {processing ? "Processing..." : "Pay $10"}
            </button>
        </form>
    );
};

const MembershipPage = () => {
    const { user, darkMode } = useAuth();
    const axiosSecure = useAxiosPublic();
    const [isMember, setIsMember] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("bg-gray-800", "text-gray-200");
            document.body.classList.remove("bg-white", "text-gray-900");
        } else {
            document.body.classList.remove("bg-gray-800", "text-gray-200");
            document.body.classList.add("bg-white", "text-gray-900");
        }
    }, [darkMode]);

    useEffect(() => {
        const fetchMembershipStatus = async () => {
            const email = user.email;
            if (!email) return;

            try {
                const res = await axiosSecure.get(`/users/membership-status?email=${email}`);
                setIsMember(res.data.isMember);
            } catch (err) {
                console.log(err);
                toast.error("Failed to fetch membership status.");
            } finally {
                setLoading(false);
            }
        };

        fetchMembershipStatus();
    }, [user, axiosSecure]);


    const upgradeUser = async () => {
        try {
            const res = await axiosSecure.patch("/users/upgrade", { email: user.email });
            if (res.data.success) {
                setIsMember(true);
            } else {
                toast.error(res.data.message || "Failed to upgrade membership.");
            }
        } catch (err) {
            console.error("Upgrade error:", err);
            toast.error("Failed to upgrade membership.");
        }
    };

    if (loading)
        return (
            <p className={`text-center mt-10 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Loading membership info...
            </p>
        );

    if (!user?.email)
        return (
            <p className={`text-center mt-10 ${darkMode ? "text-red-400" : "text-red-600"}`}>
                Please log in to access the membership page.
            </p>
        );

    return (
        <div className={`${darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"}`}>
            <div className="max-w-3xl mx-auto py-10 px-4 text-center">
                <h1 className={`text-4xl font-bold mb-6 animate-bounce ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}>
                    Membership
                </h1>

                {isMember ? (
                    <div
                        className={`rounded-xl border border-amber-500 shadow-lg p-8 max-w-2xl mx-auto transition-all duration-700 ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-yellow-100 to-yellow-200"
                            }`}
                    >
                        <div className="flex flex-col items-center gap-4 text-yellow-500">
                            <Player autoplay loop src={goldStarAnimation} style={{ height: "120px", width: "120px" }} />
                            <h2 className={`text-4xl font-bold ${darkMode ? "text-yellow-300" : ""}`}>You are a Gold Member!</h2>
                            <p className={`max-w-lg text-center ${darkMode ? "text-gray-300" : "text-gray-800"}`}>
                                Thank you for supporting us! As a valued Gold Member, you now have access to premium features and recognition across the platform.
                            </p>
                        </div>

                        <div className="mt-8">
                            <h3 className={`text-2xl font-semibold text-center mb-4 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                                Your Benefits
                            </h3>
                            <ul className={`grid grid-cols-1 sm:grid-cols-2 gap-4 font-medium ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                                <Benefit icon={<FaStar className="text-yellow-500" />} text="Unlimited posts beyond the free 5-post limit" />
                                <Benefit icon={<FaCheckCircle className="text-green-500" />} text="Exclusive Gold badge displayed on your profile" />
                                <Benefit icon={<FaCheckCircle className="text-green-500" />} text="Access to premium & beta features" />
                                <Benefit icon={<FaCheckCircle className="text-green-500" />} text="Priority support from our team" />
                            </ul>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className={`mb-6 text-lg ${darkMode ? "text-gray-300" : ""}`}>
                            Become a <span className="font-bold text-yellow-500">Gold Member</span> by paying $10.
                        </p>

                        <Elements stripe={stripePromise}>
                            <CheckoutForm email={user.email} onSuccess={upgradeUser} darkMode={darkMode} />
                        </Elements>

                        <MembershipBenefits darkMode={darkMode} />
                    </>
                )}
            </div>
        </div>
    );
};

const MembershipBenefits = ({ darkMode }) => (
    <div className={`mt-12 max-w-md mx-auto text-left space-y-4 ${darkMode ? "text-gray-300" : ""}`}>
        <h3 className={`text-2xl font-bold mb-4 text-center ${darkMode ? "text-white" : ""}`}>Membership Benefits</h3>
        <ul className="space-y-3">
            <Benefit icon={<FaStar className="text-yellow-400" />} text="Post more than 5 times" />
            <Benefit icon={<FaCheckCircle className="text-green-500" />} text="Gold badge next to your name" />
            <Benefit icon={<FaCheckCircle className="text-green-500" />} text="Access to exclusive features" />
            <Benefit icon={<FaCheckCircle className="text-green-500" />} text="Priority support" />
        </ul>
    </div>
);

const Benefit = ({ icon, text }) => (
    <li className="flex items-center gap-3 text-gray-700 dark:text-gray-600">
        {icon}
        <span>{text}</span>
    </li>
);

export default MembershipPage;
