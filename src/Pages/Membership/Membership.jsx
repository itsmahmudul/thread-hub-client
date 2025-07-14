import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import useAuth from "../../Hooks/useAuth";
import { toast } from "react-toastify";
import { FaCheckCircle, FaStar } from "react-icons/fa";
import useAxiosPublic from "../../Hooks/useAxiosPublic";

// Load Stripe outside component with your **public** key from Stripe dashboard
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ email, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosPublic();
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setProcessing(true);
        try {
            // 1. Create PaymentIntent on backend - amount in cents (e.g., 1000 = $10)
            const { data } = await axiosSecure.post("/payment/create-payment-intent", {
                amount: 1000,
                email,
            });

            // 2. Confirm Card Payment with clientSecret from backend
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

                // Call parent onSuccess callback to upgrade user in DB
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
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 p-4 border rounded shadow">
            <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
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
    const { user } = useAuth();
    const axiosSecure = useAxiosPublic();
    const [isMember, setIsMember] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembershipStatus = async () => {
            if (user?.email) {
                try {
                    const res = await axiosSecure.get(`/users/membership-status?email=${user.email}`);
                    setIsMember(res.data.isMember);
                } catch (err) {
                    console.error("Failed to fetch membership status:", err);
                    toast.error("Failed to fetch membership status.");
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchMembershipStatus();
    }, [user, axiosSecure]);

    const upgradeUser = async () => {
        console.log(axiosSecure);
        console.log(user);
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

    if (loading) return <p className="text-center mt-10">Loading membership info...</p>;

    if (!user?.email)
        return (
            <p className="text-center mt-10 text-red-600">
                Please log in to access the membership page.
            </p>
        );

    return (
        <div className="max-w-3xl mx-auto py-10 px-4 text-center">
            <h1 className="text-4xl font-bold mb-6">Membership</h1>

            {isMember ? (
                <div className="flex flex-col items-center gap-4 text-yellow-400 animate-pulse">
                    <FaStar size={64} />
                    <h2 className="text-3xl font-semibold">You are a Gold Member!</h2>
                    <p className="max-w-lg text-gray-400">
                        Enjoy unlimited posts and special privileges with your Gold badge.
                    </p>
                </div>
            ) : (
                <>
                    <p className="mb-6 text-lg">
                        Become a <span className="font-bold text-yellow-500">Gold Member</span> by paying $10.
                    </p>

                    <Elements stripe={stripePromise}>
                        <CheckoutForm email={user.email} onSuccess={upgradeUser} />
                    </Elements>

                    <MembershipBenefits />
                </>
            )}
        </div>
    );
};

const MembershipBenefits = () => (
    <div className="mt-12 max-w-md mx-auto text-left space-y-4">
        <h3 className="text-2xl font-bold mb-4 text-center">Membership Benefits</h3>
        <ul className="space-y-3">
            <Benefit icon={<FaStar className="text-yellow-400" />} text="Post more than 5 times" />
            <Benefit icon={<FaCheckCircle className="text-green-500" />} text="Gold badge next to your name" />
            <Benefit icon={<FaCheckCircle className="text-green-500" />} text="Access to exclusive features" />
            <Benefit icon={<FaCheckCircle className="text-green-500" />} text="Priority support" />
        </ul>
    </div>
);

const Benefit = ({ icon, text }) => (
    <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
        {icon}
        <span>{text}</span>
    </li>
);

export default MembershipPage;
