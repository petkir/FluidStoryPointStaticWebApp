import { devNull } from 'os';
import * as React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export interface IResultProps {
    data: {
        name: string;
        count: number;
    }[]

}

export interface IResultState { }

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent,name, index } = props;
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
          {`Card: ${name} ${(percent * 100).toFixed(0)}%`}
        </text>
    );
};


export default class Result extends React.Component<IResultProps, IResultState> {
    public render(): React.ReactElement<IResultProps> {
        const { data } = this.props;
        return (
            <div>
                <PieChart width={400} height={400}>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </div>
        );
    }
}

