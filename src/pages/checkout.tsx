import { useQuery } from "@tanstack/react-query";
import {
  ErrorMessage,
  Field,
  FieldProps,
  Form,
  Formik,
  useField,
  useFormikContext,
} from "formik";
import * as Yup from "yup";
import { clsx } from "clsx/lite";
import { memo, useCallback, useEffect, useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import Content from "@/shared/components/Content";
import { useAppContext } from "@/context/useAppContext";
import { fetchCartContent } from "@/api/requests";
import { IFetchCartContentProps } from "@/api/types";
import CartItem from "@/components/cart/CartItem";
import { useCartItemMutations, useCreateOrderMutation } from "@/api/mutations";
import Button from "@/shared/components/Button";
import AddressSearchInput from "@/shared/components/AddressSearchInput";
import { IRadioOption, Radio } from "@/shared/components/Radio";
import PaymentOptions from "@/mocks/paymentOptions.json";
import DeliveryOptions from "@/mocks/deliveryOptions.json";

const CreateOrderSchema = Yup.object().shape({
  address: Yup.string().required("Заполните поле"),
  name: Yup.string()
    .required("Заполните поле")
    .min(4, "Слишком короткое")
    .max(100, "Слишком длинное"),
  contact: Yup.string()
    .required("Заполните поле")
    .test(
      "contact",
      "Некорректный формат телефона/Email",
      (value) =>
        Yup.string().email().isValidSync(value) ||
        Yup.number().integer().positive().isValidSync(value),
    ),
  agreement: Yup.boolean().oneOf([true], "Необходимо предоставить разрешение"),
  paymentOption: Yup.string().required("Выберите удобный способ оплаты"),
  deliveryOption: Yup.string().required("Выберите удобный способ доставки"),
  postIndex: Yup.string().required(),
});

const CheckoutPage = memo(() => {
  const { user } = useAppContext();

  const cartQuery = useQuery({
    queryKey: ["cart", { user_id: user?.id }],
    queryFn: ({ queryKey }) =>
      fetchCartContent(queryKey[1] as IFetchCartContentProps),
    enabled: !!user,
  });

  const { changeQtyMutation, deleteMutation } = useCartItemMutations();
  const createOrderMutation = useCreateOrderMutation();

  const handleDelete = useCallback((cartItemId: string) => {
    deleteMutation.mutate({ cart_item_id: cartItemId });
  }, []);

  const handleChangeQty = useCallback((newCount: number, id: string) => {
    changeQtyMutation.mutate({ count: newCount, id });
  }, []);

  const handleSubmit = useCallback(
    async (values: Yup.InferType<typeof CreateOrderSchema>) => {
      await createOrderMutation.mutate({
        ...values,
        postIndex: Number(values.postIndex),
      });
    },
    [],
  );

  return (
    <Content className="pt-6 pb-20 lg:pt-12">
      <div className="flex flex-col items-center space-y-4">
        <p className="font-virilica text-3xl lg:text-4xl">Корзина</p>
        <div className="flex w-full flex-col space-y-2">
          {cartQuery.data?.content.map((item) => (
            <CartItem
              key={item.id}
              type="default"
              count={item.qty}
              id={item.id}
              product={item.product}
              isPending={
                cartQuery.isPending ||
                changeQtyMutation.isPending ||
                deleteMutation.isPending
              }
              onDelete={handleDelete}
              onQtyChange={handleChangeQty}
            />
          ))}
        </div>
        <div className="relative flex w-full justify-between lg:w-9/12 lg:px-4">
          <span>Общая стоимость заказа</span>
          <span>
            {cartQuery.data?.content.reduce(
              (acc, item) => (acc += item.product.price * item.qty),
              0,
            )}{" "}
            ₽
          </span>
          <div className="bg-pink absolute bottom-0 -left-8 h-0.5 w-screen lg:left-0 lg:w-full" />
        </div>
      </div>
      <div className="mt-8 flex lg:mt-24 lg:space-x-8">
        <Formik
          initialValues={{
            address: "",
            deliveryOption: "",
            paymentOption: "",
            name: "",
            contact: "",
            postIndex: "",
            agreement: false,
          }}
          validationSchema={CreateOrderSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <p className="mb-2 text-lg font-bold lg:mb-4">
                  Введите адрес доставки:
                </p>
                <div className="flex flex-col space-y-2">
                  <Field
                    name="address"
                    className={clsx(
                      "bg-beige placeholder:text-gray w-full rounded-lg px-5 py-2 text-sm max-lg:h-14",
                      errors.address &&
                        touched.address &&
                        "border border-red-500",
                    )}
                    component={AddressSearchInput}
                  />
                  <DeliveryOptionsField name="deliveryOption" />
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <p className="text-lg font-bold">Выберите способ оплаты:</p>
                  <ErrorMessage
                    name="paymentOption"
                    className="text-sm text-red-500"
                    component="span"
                  />
                </div>
                <Field
                  name="paymentOption"
                  component={({ field }: FieldProps) => (
                    <div className="flex flex-col space-y-2">
                      {PaymentOptions.map(({ value, displayName }) => (
                        <Radio
                          {...field}
                          key={value}
                          value={value}
                          displayName={displayName}
                          checked={field.value === value}
                        />
                      ))}
                    </div>
                  )}
                />
              </div>
              <div>
                <p className="mb-4 text-lg font-bold">Заполните ваши данные:</p>
                <div className="flex flex-col space-y-4">
                  <Field
                    name="name"
                    className={clsx(
                      "bg-beige placeholder:text-gray rounded-lg px-5 py-2 text-sm max-lg:h-14",
                      errors.name && touched.name && "border border-red-500",
                    )}
                    placeholder="ФИО"
                  />
                  <Field
                    name="contact"
                    className={clsx(
                      "bg-beige placeholder:text-gray rounded-lg px-5 py-2 text-sm max-lg:h-14",
                      errors.contact &&
                        touched.contact &&
                        "border border-red-500",
                    )}
                    placeholder="Телефон/Email"
                  />
                  <Field
                    name="postIndex"
                    className={clsx(
                      "bg-beige placeholder:text-gray rounded-lg px-5 py-2 text-sm max-lg:h-14",
                      errors.postIndex &&
                        touched.postIndex &&
                        "border border-red-500",
                    )}
                    placeholder="Почтовый индекс"
                  />
                  <div>
                    <ErrorMessage
                      name="agreement"
                      className="text-sm text-red-500"
                      component="span"
                    />
                    <label className="flex space-x-2 text-sm">
                      <Field
                        name="agreement"
                        type="checkbox"
                        className="size-4 shrink-0"
                      />
                      <span>
                        Я даю разрешение на обработку своих персональных данных
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              <Button className="w-full max-lg:h-14" size="large" type="submit">
                {isSubmitting && "Загрузка"}
                {!isSubmitting && "Оформить покупку"}
              </Button>
            </Form>
          )}
        </Formik>
        <div className="hidden lg:block" />
      </div>
    </Content>
  );
});

export default CheckoutPage;

interface IDeliveryOption extends IRadioOption {
  price: string;
}

const DeliveryOptionsField = ({ name }: { name: string }) => {
  const [options, setOptions] = useState<IDeliveryOption[]>([]);

  const {
    values: { address },
  } = useFormikContext<Yup.InferType<typeof CreateOrderSchema>>();

  const [field] = useField({ name });

  useEffect(() => {
    let isCurrent: boolean = true;

    const init = async () => {
      if (address) {
        setOptions([]);
        await new Promise((res) => setTimeout(res, 2000));
        if (isCurrent) {
          setOptions(DeliveryOptions);
        }
      }
    };

    init();

    return () => {
      isCurrent = false;
    };
  }, [address]);

  return (
    <div className="text-sm">
      <span>По вашему адресу доступны следующие варианты доставки:</span>
      {address && options.length === 0 && (
        <div className="flex w-full items-center justify-center py-4">
          <ArrowPathIcon className="size-4 animate-spin" />
        </div>
      )}
      {options.length !== 0 && (
        <div>
          <ErrorMessage
            name="deliveryOption"
            className="text-sm text-red-500"
            component="span"
          />
          <div className="mt-2 flex flex-col space-y-2">
            {options.map(({ value, displayName, price }) => (
              <div key={value} className="flex justify-between">
                <Radio {...field} value={value} displayName={displayName} />
                <span className="text-base font-bold">{price} ₽</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
